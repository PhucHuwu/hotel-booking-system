import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { AddAddonDto, UpdateAddonDto } from './dto/staff.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoomMap(floor?: number) {
    return this.prisma.room.findMany({
      where: floor !== undefined ? { floor } : {},
      include: {
        roomType: { select: { name: true, maxGuests: true } },
        bookings: {
          where: {
            status: { in: [BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN] },
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            customer: {
              select: { firstName: true, lastName: true, phone: true },
            },
          },
        },
      },
      orderBy: [{ floor: 'asc' }, { roomNumber: 'asc' }],
    });
  }

  async updateRoomStatus(roomId: string, status: string) {
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Phòng không tồn tại');
    return this.prisma.room.update({
      where: { id: roomId },
      data: { status: status as any },
      include: { roomType: true },
    });
  }

  async addAddon(bookingId: string, staffId: string, dto: AddAddonDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException('Đơn không tồn tại');
    if (booking.status !== BookingStatus.CHECKED_IN) {
      throw new BadRequestException('Chỉ có thể thêm dịch vụ khi khách đang ở');
    }

    const totalPrice = dto.unitPrice * dto.quantity;
    const addon = await this.prisma.bookingAddon.create({
      data: {
        bookingId,
        serviceName: dto.serviceName,
        quantity: dto.quantity,
        unitPrice: dto.unitPrice,
        totalPrice,
        staffNote: dto.staffNote,
        addedBy: staffId,
      },
    });

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { totalAmount: { increment: totalPrice } },
    });

    return addon;
  }

  async updateAddon(addonId: string, dto: UpdateAddonDto) {
    const addon = await this.prisma.bookingAddon.findUnique({
      where: { id: addonId },
    });
    if (!addon) throw new NotFoundException('Dịch vụ không tồn tại');

    const newQuantity = dto.quantity ?? addon.quantity;
    const newTotal = Number(addon.unitPrice) * newQuantity;
    const diff = newTotal - Number(addon.totalPrice);

    const updated = await this.prisma.bookingAddon.update({
      where: { id: addonId },
      data: {
        quantity: newQuantity,
        totalPrice: newTotal,
        staffNote: dto.staffNote ?? addon.staffNote,
      },
    });

    if (diff !== 0) {
      await this.prisma.booking.update({
        where: { id: addon.bookingId },
        data: { totalAmount: { increment: diff } },
      });
    }

    return updated;
  }

  async deleteAddon(addonId: string) {
    const addon = await this.prisma.bookingAddon.findUnique({
      where: { id: addonId },
    });
    if (!addon) throw new NotFoundException('Dịch vụ không tồn tại');

    await this.prisma.booking.update({
      where: { id: addon.bookingId },
      data: { totalAmount: { decrement: Number(addon.totalPrice) } },
    });

    await this.prisma.bookingAddon.delete({ where: { id: addonId } });
    return { message: 'Đã xóa dịch vụ' };
  }

  async getAddonsByBooking(bookingId: string) {
    return this.prisma.bookingAddon.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
