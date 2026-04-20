import { Module, Global } from "@nestjs/common";
import { EventsService } from "./events.service";

@Global()
@Module({
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
