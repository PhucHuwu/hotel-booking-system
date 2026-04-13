import { Controller, Get, Query } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { ReportsService } from "./reports.service";
import { Roles } from "../common/decorators/roles.decorator";

@ApiTags("Reports")
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller({ path: "reports", version: "1" })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("revenue")
  @ApiOperation({ summary: "Báo cáo doanh thu (Admin)" })
  @ApiQuery({ name: "from", required: true, example: "2026-01-01" })
  @ApiQuery({ name: "to", required: true, example: "2026-01-31" })
  @ApiQuery({
    name: "groupBy",
    required: false,
    enum: ["day", "week", "month"],
  })
  getRevenue(
    @Query("from") from: string,
    @Query("to") to: string,
    @Query("groupBy") groupBy: "day" | "week" | "month" = "day",
  ) {
    return this.reportsService.getRevenueReport(from, to, groupBy);
  }

  @Get("occupancy")
  @ApiOperation({ summary: "Báo cáo tỷ lệ lấp phòng (Admin)" })
  getOccupancy(@Query("from") from: string, @Query("to") to: string) {
    return this.reportsService.getOccupancyReport(from, to);
  }

  @Get("bookings/summary")
  @ApiOperation({ summary: "Tổng hợp trạng thái đơn (Admin)" })
  getBookingsSummary(@Query("from") from: string, @Query("to") to: string) {
    return this.reportsService.getBookingStatusSummary(from, to);
  }
}
