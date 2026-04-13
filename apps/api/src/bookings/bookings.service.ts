import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { RedisService } from '../common/redis/redis.service';
import { RabbitMQService } from '../common/rabbitmq/rabbitmq.service';
import { PricingService } from '../rooms/pricing.service';
import { CreateBookingDto } from './dto/bookings.dto';
import { BookingStatus, Role } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly rabbitmq: RabbitMQService,
    private readonly pricingService: PricingService,
  ) {}

  async createBooking(customerId: string, dto: CreateBookingDto) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    if (checkOut <= checkIn) {
      throw new BadRequestException('Ngày trả phòng phải sau ngày nhận phòng');
    }

    const lockKey = `booking:lock:${dto.roomId}:${dto.checkIn}:${dto.checkOut}`;
    const acquired = await this.redis.setNx(lockKey, customerId, 10000);
    if (!acquired) {
      throw new ConflictException('Phòng này đang được đặt bởi người khác, vui lòng thử lại');
    }

    try {
      const room = await this.prisma.room.findUnique({
        where: { id: dto.roomId },
        include: { roomType: true },
      });
      if (!room) throw new NotFoundException('Phòng không tồn tại');
      if (!room.roomType.isActive) throw new BadRequestException('Loại phòng không còn hoạt động');

      const conflict = await this.prisma.booking.findFirst({
        where: {
          roomId: dto.roomId,
          status: {
            in: ['PENDING_PAYMENT', 'PAYING', 'CONFIRMED', 'CHECKED_IN'],
          },
          AND: [{ checkIn: { lt: checkOut } }, { checkOut: { gt: checkIn } }],
        },
      });
      if (conflict) throw new ConflictException('Phòng đã được đặt trong khoảng thời gian này');

      const totalAmount = await this.pricingService.calculateTotalPrice(
        room.roomTypeId,
        checkIn,
        checkOut,
      );

      const paymentDeadline = new Date(Date.now() + 15 * 60 * 1000);

      const booking = await this.prisma.booking.create({
        data: {
          customerId,
          roomId: dto.roomId,
          checkIn,
          checkOut,
          totalAmount,
          paymentDeadline,
          guestNotes: dto.guestNotes,
          status: BookingStatus.PENDING_PAYMENT,
        },
        include: { room: { include: { roomType: true } } },
      });

      await this.publishOutbox('hotel.events', 'booking.created', {
        bookingId: booking.id,
        customerId,
        roomId: dto.roomId,
        totalAmount,
      });

      return booking;
    } finally {
      await this.redis.del(lockKey);
    }
  }

  async getMyBookings(customerId: string, page = 1, limit = 10, status?: BookingStatus) {
    const skip = (page - 1) * limit;
    const where: any = { customerId };
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        include: {
          room: { include: { roomType: true } },
          addons: true,
          payment: true,
          review: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.booking.count({ where }),
    ]);
    return { items, total, page, limit };
  }

  async getBookingById(id: string, user: { id: string; role: Role }) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        room: { include: { roomType: true } },
        addons: true,
        payment: true,
        review: true,
      },
    });
    if (!booking) throw new NotFoundException('Đơn đặt phòng không tồn tại');

    const canView =
      booking.customerId === user.id || user.role === Role.ADMIN || user.role === Role.RECEPTIONIST;
    if (!canView) throw new ForbiddenException('Không có quyền xem đơn này');

    return booking;
  }

  async cancelBooking(bookingId: string, userId: string, reason?: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException('Đơn đặt phòng không tồn tại');
    if (booking.customerId !== userId) throw new ForbiddenException('Không có quyền hủy đơn này');

    const cancellable: BookingStatus[] = [
      BookingStatus.PENDING_PAYMENT,
      BookingStatus.PAYING,
      BookingStatus.CONFIRMED,
    ];
    if (!cancellable.includes(booking.status)) {
      throw new BadRequestException('Không thể hủy đơn ở trạng thái này');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CANCELLED },
    });

    await this.rabbitmq.publish('hotel.events', 'booking.cancelled', {
      bookingId,
      customerId: userId,
      reason: reason ?? 'Customer cancelled',
    });

    return updated;
  }

  async confirmBooking(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException('Đơn không tồn tại');

    if (
      booking.status !== BookingStatus.PENDING_PAYMENT &&
      booking.status !== BookingStatus.PAYING
    ) {
      return booking;
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CONFIRMED },
    });

    await this.rabbitmq.publish('hotel.events', 'booking.confirmed', {
      bookingId,
      customerId: booking.customerId,
    });

    await this.publishOutbox('hotel.notifications', 'notification.email', {
      type: 'booking.confirmed',
      bookingId,
      customerId: booking.customerId,
    });

    return updated;
  }

  async expireBooking(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) return;

    if (
      booking.status !== BookingStatus.PENDING_PAYMENT &&
      booking.status !== BookingStatus.PAYING
    ) {
      return;
    }

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.EXPIRED },
    });

    await this.rabbitmq.publish('hotel.events', 'booking.expired', {
      bookingId,
      customerId: booking.customerId,
    });
  }

  async checkin(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: true },
    });
    if (!booking) throw new NotFoundException('Đơn không tồn tại');
    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Đơn phải ở trạng thái CONFIRMED để check-in');
    }

    const [updatedBooking] = await this.prisma.$transaction([
      this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CHECKED_IN, checkInActual: new Date() },
      }),
      this.prisma.room.update({
        where: { id: booking.roomId },
        data: { status: 'OCCUPIED' },
      }),
    ]);

    return updatedBooking;
  }

  async checkout(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: true, addons: true },
    });
    if (!booking) throw new NotFoundException('Đơn không tồn tại');
    if (booking.status !== BookingStatus.CHECKED_IN) {
      throw new BadRequestException('Khách chưa check-in');
    }

    const addonTotal = booking.addons.reduce((sum, a) => sum + Number(a.totalPrice), 0);
    const finalAmount = Number(booking.totalAmount) + addonTotal;

    const [updatedBooking] = await this.prisma.$transaction([
      this.prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CHECKED_OUT,
          checkOutActual: new Date(),
          totalAmount: finalAmount,
        },
      }),
      this.prisma.room.update({
        where: { id: booking.roomId },
        data: { status: 'DIRTY' },
      }),
    ]);

    await this.publishOutbox('hotel.notifications', 'notification.email', {
      type: 'checkout.completed',
      bookingId,
      customerId: booking.customerId,
      finalAmount,
    });

    return updatedBooking;
  }

  async getExpiredBookings() {
    return this.prisma.booking.findMany({
      where: {
        status: { in: [BookingStatus.PENDING_PAYMENT] },
        paymentDeadline: { lt: new Date() },
      },
    });
  }

  private async publishOutbox(exchange: string, routingKey: string, payload: object) {
    await this.prisma.outboxEvent.create({
      data: {
        aggregateId: (payload as any).bookingId ?? 'unknown',
        eventType: routingKey,
        exchange,
        routingKey,
        payload,
      },
    });
    await this.rabbitmq.publish(exchange, routingKey, payload);
  }
}
