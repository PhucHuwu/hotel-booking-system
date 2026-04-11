import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { UsersService } from "./users.service";
import { UpdateProfileDto, CreateStaffDto } from "./dto/users.dto";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";

@ApiTags("Users")
@ApiBearerAuth()
@Controller({ path: "users", version: "1" })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @ApiOperation({ summary: "Lấy thông tin cá nhân" })
  getMe(@CurrentUser() user: { id: string }) {
    return this.usersService.getMe(user.id);
  }

  @Patch("me")
  @ApiOperation({ summary: "Cập nhật thông tin cá nhân" })
  updateMe(@CurrentUser() user: { id: string }, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateMe(user.id, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Danh sách người dùng (Admin)" })
  listUsers(
    @Query("page") page = 1,
    @Query("limit") limit = 20,
    @Query("role") role?: Role,
  ) {
    return this.usersService.listUsers(+page, +limit, role);
  }

  @Post("staff")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Tạo tài khoản nhân viên (Admin)" })
  createStaff(@Body() dto: CreateStaffDto) {
    return this.usersService.createStaff(dto);
  }

  @Patch(":id/toggle-lock")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Khóa/Mở khóa tài khoản (Admin)" })
  toggleLock(@Param("id") id: string, @CurrentUser() user: { id: string }) {
    return this.usersService.toggleLock(id, user.id);
  }
}
