import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role, BookingStatus } from '@prisma/client';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, CancelBookingDto } from './dto/bookings.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller({ path: 'bookings', version: '1' })
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(Role.CUSTOMER)
  @ApiOperation({ summary: 'Tạo đơn đặt phòng' })
  createBooking(@CurrentUser() user: { id: string }, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(user.id, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Lịch sử đặt phòng của tôi' })
  getMyBookings(
    @CurrentUser() user: { id: string },
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: BookingStatus,
  ) {
    return this.bookingsService.getMyBookings(user.id, +page, +limit, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết đơn đặt phòng' })
  getBooking(@Param('id') id: string, @CurrentUser() user: { id: string; role: Role }) {
    return this.bookingsService.getBookingById(id, user);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Hủy đơn đặt phòng' })
  cancelBooking(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: CancelBookingDto,
  ) {
    return this.bookingsService.cancelBooking(id, user.id, dto.reason);
  }

  @Post(':id/checkin')
  @Roles(Role.RECEPTIONIST, Role.ADMIN)
  @ApiOperation({ summary: 'Check-in (Staff)' })
  checkin(@Param('id') id: string) {
    return this.bookingsService.checkin(id);
  }

  @Post(':id/checkout')
  @Roles(Role.RECEPTIONIST, Role.ADMIN)
  @ApiOperation({ summary: 'Check-out (Staff)' })
  checkout(@Param('id') id: string) {
    return this.bookingsService.checkout(id);
  }
}
