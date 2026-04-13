import { Controller, Get, Query, BadRequestException } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { SearchService } from "./search.service";
import { Public } from "../common/decorators/public.decorator";

@ApiTags("Search")
@Controller({ path: "search", version: "1" })
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Tìm kiếm phòng trống" })
  @ApiQuery({ name: "checkIn", required: true, example: "2026-05-01" })
  @ApiQuery({ name: "checkOut", required: true, example: "2026-05-03" })
  @ApiQuery({ name: "guests", required: true, example: 2 })
  @ApiQuery({ name: "roomTypeId", required: false })
  @ApiQuery({ name: "minPrice", required: false })
  @ApiQuery({ name: "maxPrice", required: false })
  search(
    @Query("checkIn") checkIn: string,
    @Query("checkOut") checkOut: string,
    @Query("guests") guests: string,
    @Query("roomTypeId") roomTypeId?: string,
    @Query("minPrice") minPrice?: string,
    @Query("maxPrice") maxPrice?: string,
  ) {
    if (!checkIn || !checkOut || !guests) {
      throw new BadRequestException("checkIn, checkOut và guests là bắt buộc");
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      throw new BadRequestException("Ngày không hợp lệ");
    }

    if (checkInDate < now) {
      throw new BadRequestException("Ngày nhận phòng không thể trong quá khứ");
    }

    if (checkOutDate <= checkInDate) {
      throw new BadRequestException("Ngày trả phòng phải sau ngày nhận phòng");
    }

    return this.searchService.searchAvailableRooms({
      checkIn,
      checkOut,
      guests: parseInt(guests),
      roomTypeId,
      minPrice: minPrice !== undefined ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice !== undefined ? parseFloat(maxPrice) : undefined,
    });
  }
}
