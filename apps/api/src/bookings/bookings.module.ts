import { Module } from "@nestjs/common";
import { BookingsController } from "./bookings.controller";
import { BookingsService } from "./bookings.service";
import { BookingEventHandlers } from "./booking.events";
import { RoomsModule } from "../rooms/rooms.module";

@Module({
  imports: [RoomsModule],
  controllers: [BookingsController],
  providers: [BookingsService, BookingEventHandlers],
  exports: [BookingsService],
})
export class BookingsModule {}
