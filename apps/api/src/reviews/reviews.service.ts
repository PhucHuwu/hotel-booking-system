import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { BookingStatus } from '@prisma/client';
import { CreateReviewDto } from './dto/reviews.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(customerId: string, dto: CreateReviewDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { room: true },
    });

    if (!booking) throw new NotFoundException('Đơn đặt phòng không tồn tại');
    if (booking.customerId !== customerId) {
      throw new BadRequestException('Không có quyền đánh giá đơn này');
    }
    if (booking.status !== BookingStatus.CHECKED_OUT) {
      throw new BadRequestException('Chỉ có thể đánh giá sau khi trả phòng');
    }

    const existing = await this.prisma.review.findUnique({
      where: { bookingId: dto.bookingId },
    });
    if (existing) throw new ConflictException('Đơn này đã được đánh giá');

    return this.prisma.review.create({
      data: {
        bookingId: dto.bookingId,
        customerId,
        roomTypeId: booking.room.roomTypeId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: { booking: true },
    });
  }

  async getReviewsByRoomType(roomTypeId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { roomTypeId, isApproved: true },
        skip,
        take: limit,
        include: { customer: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where: { roomTypeId, isApproved: true } }),
    ]);

    const avgRating =
      total > 0
        ? ((
            await this.prisma.review.aggregate({
              where: { roomTypeId, isApproved: true },
              _avg: { rating: true },
            })
          )._avg.rating ?? 0)
        : 0;

    return { items, total, page, limit, avgRating };
  }
}
