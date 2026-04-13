import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { PaymentStatus, BookingStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRevenueReport(from: string, to: string, groupBy: 'day' | 'week' | 'month' = 'day') {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const payments = await this.prisma.payment.findMany({
      where: {
        status: PaymentStatus.COMPLETED,
        paidAt: { gte: fromDate, lte: toDate },
      },
      include: {
        booking: {
          include: { room: { include: { roomType: true } } },
        },
      },
      orderBy: { paidAt: 'asc' },
    });

    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalBookings = payments.length;

    const byRoomType: Record<string, { count: number; revenue: number }> = {};
    for (const p of payments) {
      const typeName = p.booking.room.roomType.name;
      if (!byRoomType[typeName]) byRoomType[typeName] = { count: 0, revenue: 0 };
      byRoomType[typeName].count++;
      byRoomType[typeName].revenue += Number(p.amount);
    }

    return {
      from,
      to,
      totalRevenue,
      totalBookings,
      byRoomType,
    };
  }

  async getOccupancyReport(from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const totalRooms = await this.prisma.room.count();

    const checkedIn = await this.prisma.booking.count({
      where: {
        status: { in: [BookingStatus.CHECKED_IN, BookingStatus.CHECKED_OUT] },
        checkIn: { gte: fromDate },
        checkOut: { lte: toDate },
      },
    });

    const days = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalRoomNights = totalRooms * days;
    const occupancyRate = totalRoomNights > 0 ? (checkedIn / totalRoomNights) * 100 : 0;

    const byRoomType = await this.prisma.booking.groupBy({
      by: ['roomId'],
      where: {
        status: { in: [BookingStatus.CHECKED_IN, BookingStatus.CHECKED_OUT] },
        checkIn: { gte: fromDate },
        checkOut: { lte: toDate },
      },
      _count: { id: true },
    });

    return {
      from,
      to,
      totalRooms,
      totalRoomNights,
      occupiedNights: checkedIn,
      occupancyRate: Math.round(occupancyRate * 100) / 100,
    };
  }

  async getBookingStatusSummary(from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const summary = await this.prisma.booking.groupBy({
      by: ['status'],
      where: { createdAt: { gte: fromDate, lte: toDate } },
      _count: { id: true },
    });

    return summary.map((s) => ({ status: s.status, count: s._count.id }));
  }
}
