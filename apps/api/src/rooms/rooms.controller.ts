import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { RoomsService } from "./rooms.service";
import {
  CreateRoomTypeDto,
  UpdateRoomTypeDto,
  CreateRoomDto,
  UpdateRoomDto,
  CreatePricingRuleDto,
} from "./dto/rooms.dto";
import { Roles } from "../common/decorators/roles.decorator";

@ApiTags("Rooms")
@ApiBearerAuth()
@Controller({ path: "rooms", version: "1" })
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get("types")
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: "Danh sách loại phòng" })
  listRoomTypes(@Query("includeInactive") includeInactive?: string) {
    return this.roomsService.listRoomTypes(includeInactive === "true");
  }

  @Post("types")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Tạo loại phòng (Admin)" })
  createRoomType(@Body() dto: CreateRoomTypeDto) {
    return this.roomsService.createRoomType(dto);
  }

  @Get("types/:id")
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  @ApiOperation({ summary: "Chi tiết loại phòng" })
  getRoomType(@Param("id") id: string) {
    return this.roomsService.getRoomType(id);
  }

  @Patch("types/:id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Cập nhật loại phòng (Admin)" })
  updateRoomType(@Param("id") id: string, @Body() dto: UpdateRoomTypeDto) {
    return this.roomsService.updateRoomType(id, dto);
  }

  @Delete("types/:id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Xóa loại phòng (Admin)" })
  deleteRoomType(@Param("id") id: string) {
    return this.roomsService.deleteRoomType(id);
  }

  @Get()
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.HOUSEKEEPING)
  @ApiOperation({ summary: "Danh sách phòng" })
  listRooms(
    @Query("roomTypeId") roomTypeId?: string,
    @Query("floor") floor?: string,
  ) {
    return this.roomsService.listRooms(
      roomTypeId,
      floor !== undefined ? +floor : undefined,
    );
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Tạo phòng (Admin)" })
  createRoom(@Body() dto: CreateRoomDto) {
    return this.roomsService.createRoom(dto);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.HOUSEKEEPING)
  @ApiOperation({ summary: "Cập nhật trạng thái phòng" })
  updateRoom(@Param("id") id: string, @Body() dto: UpdateRoomDto) {
    return this.roomsService.updateRoom(id, dto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Xóa phòng (Admin)" })
  deleteRoom(@Param("id") id: string) {
    return this.roomsService.deleteRoom(id);
  }

  @Post("pricing")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Tạo quy tắc giá (Admin)" })
  createPricingRule(@Body() dto: CreatePricingRuleDto) {
    return this.roomsService.createPricingRule(dto);
  }

  @Delete("pricing/:id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Xóa quy tắc giá (Admin)" })
  deletePricingRule(@Param("id") id: string) {
    return this.roomsService.deletePricingRule(id);
  }
}
