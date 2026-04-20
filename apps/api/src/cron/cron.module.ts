import { Module } from "@nestjs/common";
import { CronController } from "./cron.controller";
import { BookingsModule } from "../bookings/bookings.module";

@Module({
  imports: [BookingsModule],
  controllers: [CronController],
})
export class CronModule {}
