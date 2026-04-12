import { Module } from "@nestjs/common";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";
import { RoomsModule } from "../rooms/rooms.module";

@Module({
  imports: [RoomsModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
