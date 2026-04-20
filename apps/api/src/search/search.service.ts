import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { RedisService } from "../common/redis/redis.service";
import { PricingService } from "../rooms/pricing.service";

export interface SearchParams {
  checkIn: string;
  checkOut: string;
  guests: number;
  roomTypeId?: string;
  maxPrice?: number;
  minPrice?: number;
}

@Injectable()
export class SearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly pricingService: PricingService,
  ) {}

  async searchAvailableRooms(params: SearchParams) {
    const cacheKey = `search:${JSON.stringify(params)}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const checkIn = new Date(params.checkIn);
    const checkOut = new Date(params.checkOut);

    const bookedRoomIds = await this.getBookedRoomIds(checkIn, checkOut);

    const roomTypes = await this.prisma.roomType.findMany({
      where: {
        isActive: true,
        maxGuests: { gte: params.guests },
        ...(params.roomTypeId && { id: params.roomTypeId }),
      },
      include: {
        rooms: {
          where: {
            status: { in: ["AVAILABLE", "DIRTY"] },
            id: { notIn: bookedRoomIds },
          },
        },
      },
    });

    const results = [];

    for (const roomType of roomTypes) {
      if (roomType.rooms.length === 0) continue;

      const totalPrice = await this.pricingService.calculateTotalPrice(
        roomType.id,
        checkIn,
        checkOut,
      );

      const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
      );
      const pricePerNight = totalPrice / nights;

      if (params.minPrice !== undefined && pricePerNight < params.minPrice)
        continue;
      if (params.maxPrice !== undefined && pricePerNight > params.maxPrice)
        continue;

      results.push({
        roomType: {
          id: roomType.id,
          name: roomType.name,
          description: roomType.description,
          maxGuests: roomType.maxGuests,
          areaSqm: roomType.areaSqm,
          bedType: roomType.bedType,
          amenities: roomType.amenities,
          images: roomType.images,
        },
        availableRooms: roomType.rooms.length,
        availableRoomIds: roomType.rooms.map((r) => r.id),
        pricePerNight,
        totalPrice,
        nights,
      });
    }

    await this.redis.set(cacheKey, JSON.stringify(results), 60);
    return results;
  }

  private async getBookedRoomIds(
    checkIn: Date,
    checkOut: Date,
  ): Promise<string[]> {
    const conflicting = await this.prisma.booking.findMany({
      where: {
        status: {
          in: ["PENDING_PAYMENT", "PAYING", "CONFIRMED", "CHECKED_IN"],
        },
        AND: [{ checkIn: { lt: checkOut } }, { checkOut: { gt: checkIn } }],
      },
      select: { roomId: true },
    });
    return conflicting.map((b) => b.roomId);
  }
}
