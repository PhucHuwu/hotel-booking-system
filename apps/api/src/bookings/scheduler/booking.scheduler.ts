import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BookingsService } from '../bookings.service';
import { RedisService } from '../../common/redis/redis.service';

@Injectable()
export class BookingScheduler {
  private readonly logger = new Logger(BookingScheduler.name);

  constructor(
    private readonly bookingsService: BookingsService,
    private readonly redis: RedisService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async expireUnpaidBookings() {
    const lockKey = 'scheduler:booking:expire';
    const acquired = await this.redis.setNx(lockKey, '1', 55000);
    if (!acquired) {
      this.logger.debug('Booking expiry scheduler already running on another instance');
      return;
    }

    try {
      const expired = await this.bookingsService.getExpiredBookings();
      this.logger.log(`Found ${expired.length} bookings to expire`);

      for (const booking of expired) {
        try {
          await this.bookingsService.expireBooking(booking.id);
          this.logger.log(`Expired booking ${booking.id}`);
        } catch (err) {
          this.logger.error(`Failed to expire booking ${booking.id}`, err);
        }
      }
    } finally {
      await this.redis.del(lockKey);
    }
  }
}
