import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { PricingType } from '@prisma/client';

@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateTotalPrice(roomTypeId: string, checkIn: Date, checkOut: Date): Promise<number> {
    const nights = this.calcNights(checkIn, checkOut);
    let total = 0;

    for (let i = 0; i < nights; i++) {
      const date = new Date(checkIn);
      date.setDate(date.getDate() + i);
      const price = await this.getPriceForDate(roomTypeId, date);
      total += price;
    }

    return total;
  }

  async getPriceForDate(roomTypeId: string, date: Date): Promise<number> {
    const rules = await this.prisma.pricingRule.findMany({
      where: {
        roomTypeId,
        isActive: true,
        OR: [
          {
            startDate: null,
            endDate: null,
          },
          {
            startDate: { lte: date },
            endDate: { gte: date },
          },
        ],
      },
      orderBy: { priority: 'desc' },
    });

    if (rules.length === 0) {
      throw new Error(`Không tìm thấy quy tắc giá cho ngày ${date.toISOString()}`);
    }

    return Number(rules[0].pricePerNight);
  }

  private calcNights(checkIn: Date, checkOut: Date): number {
    const ms = checkOut.getTime() - checkIn.getTime();
    return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }
}
