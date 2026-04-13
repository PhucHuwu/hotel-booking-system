import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { StaffService } from "./staff.service";
import { AddAddonDto, UpdateAddonDto } from "./dto/staff.dto";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";

class UpdateRoomStatusDto {
  @ApiProperty()
  @IsString()
  status!: string;
}

@ApiTags("Staff")
@ApiBearerAuth()
@Roles(Role.RECEPTIONIST, Role.HOUSEKEEPING, Role.ADMIN)
@Controller({ path: "staff", version: "1" })
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get("room-map")
  @ApiOperation({ summary: "Sơ đồ phòng thời gian thực" })
  getRoomMap(@Query("floor") floor?: string) {
    return this.staffService.getRoomMap(
      floor !== undefined ? +floor : undefined,
    );
  }

  @Patch("room-map/:roomId")
  @ApiOperation({ summary: "Cập nhật trạng thái phòng" })
  updateRoomStatus(
    @Param("roomId") roomId: string,
    @Body() dto: UpdateRoomStatusDto,
  ) {
    return this.staffService.updateRoomStatus(roomId, dto.status);
  }

  @Get("bookings/:bookingId/addons")
  @ApiOperation({ summary: "Danh sách dịch vụ phát sinh theo đơn" })
  getAddons(@Param("bookingId") bookingId: string) {
    return this.staffService.getAddonsByBooking(bookingId);
  }

  @Post("bookings/:bookingId/addons")
  @ApiOperation({ summary: "Ghi nhận dịch vụ phát sinh" })
  addAddon(
    @Param("bookingId") bookingId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: AddAddonDto,
  ) {
    return this.staffService.addAddon(bookingId, user.id, dto);
  }

  @Patch("addons/:id")
  @ApiOperation({ summary: "Cập nhật dịch vụ phát sinh" })
  updateAddon(@Param("id") id: string, @Body() dto: UpdateAddonDto) {
    return this.staffService.updateAddon(id, dto);
  }

  @Delete("addons/:id")
  @ApiOperation({ summary: "Xóa dịch vụ phát sinh" })
  deleteAddon(@Param("id") id: string) {
    return this.staffService.deleteAddon(id);
  }
}
