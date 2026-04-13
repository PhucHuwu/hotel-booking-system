import { Module } from "@nestjs/common";
import { BookingsController } from "./bookings.controller";
import { BookingsService } from "./bookings.service";
import { BookingSaga } from "./saga/booking.saga";
import { BookingScheduler } from "./scheduler/booking.scheduler";
import { RoomsModule } from "../rooms/rooms.module";

@Module({
  imports: [RoomsModule],
  controllers: [BookingsController],
  providers: [BookingsService, BookingSaga, BookingScheduler],
  exports: [BookingsService],
})
export class BookingsModule {}
