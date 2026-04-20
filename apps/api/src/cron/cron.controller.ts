import {
  Controller,
  Post,
  Headers,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiExcludeController } from "@nestjs/swagger";
import { Public } from "../common/decorators/public.decorator";
import { BookingsService } from "../bookings/bookings.service";
import { RedisService } from "../common/redis/redis.service";

/**
 * Cron-friendly endpoints. Authenticated by a static bearer secret so it can
 * be triggered by Vercel Cron, cron-job.org, or any external scheduler.
 *
 *   curl -X POST https://api.example.com/api/v1/internal/cron/expire-bookings \
 *        -H "Authorization: Bearer $CRON_SECRET"
 */
@ApiExcludeController()
@Controller({ path: "internal/cron", version: "1" })
export class CronController {
  private readonly logger = new Logger(CronController.name);

  constructor(
    private readonly config: ConfigService,
    private readonly bookings: BookingsService,
    private readonly redis: RedisService,
  ) {}

  @Public()
  @Post("expire-bookings")
  async expireBookings(@Headers("authorization") auth?: string) {
    this.assertCronSecret(auth);

    // Distributed lock so overlapping invocations don't double-process.
    const lockKey = "cron:booking:expire";
    const acquired = await this.redis.setNx(lockKey, "1", 50_000);
    if (!acquired) {
      this.logger.debug("Another cron run is in progress, skipping");
      return { skipped: true };
    }

    try {
      const expired = await this.bookings.getExpiredBookings();
      this.logger.log(`Found ${expired.length} bookings to expire`);
      for (const booking of expired) {
        try {
          await this.bookings.expireBooking(booking.id);
        } catch (err) {
          this.logger.error(
            `Failed to expire ${booking.id}: ${err instanceof Error ? err.message : String(err)}`,
          );
        }
      }
      return { processed: expired.length };
    } finally {
      await this.redis.del(lockKey);
    }
  }

  private assertCronSecret(auth?: string): void {
    const secret = this.config.get<string>("CRON_SECRET");
    if (!secret) {
      throw new UnauthorizedException("CRON_SECRET is not configured");
    }
    const expected = `Bearer ${secret}`;
    if (auth !== expected) {
      throw new UnauthorizedException("Invalid cron secret");
    }
  }
}
