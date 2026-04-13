import { Module } from "@nestjs/common";
import { RoomsController } from "./rooms.controller";
import { RoomsService } from "./rooms.service";
import { PricingService } from "./pricing.service";

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, PricingService],
  exports: [RoomsService, PricingService],
})
export class RoomsModule {}
