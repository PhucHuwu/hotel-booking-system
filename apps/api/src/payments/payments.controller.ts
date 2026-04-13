import { Controller, Post, Get, Body, Param, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import { PaymentsService } from './payments.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

class InitiatePaymentDto {
  @ApiProperty()
  @IsString()
  bookingId!: string;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;
}

@ApiTags('Payments')
@ApiBearerAuth()
@Controller({ path: 'payments', version: '1' })
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  @ApiOperation({ summary: 'Khởi tạo thanh toán' })
  initiatePayment(
    @CurrentUser() user: { id: string },
    @Body() dto: InitiatePaymentDto,
    @Req() req: Request,
  ) {
    const ipAddr =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ??
      req.socket.remoteAddress ??
      '127.0.0.1';
    return this.paymentsService.initiatePayment(dto.bookingId, user.id, dto.method, ipAddr);
  }

  @Public()
  @Get('webhook/vnpay')
  @ApiOperation({ summary: 'VNPay webhook callback (public)' })
  vnpayWebhook(@Query() query: Record<string, string>) {
    return this.paymentsService.handleWebhook(query);
  }

  @Get('booking/:bookingId')
  @ApiOperation({ summary: 'Lấy thông tin thanh toán theo đơn' })
  getPayment(@Param('bookingId') bookingId: string, @CurrentUser() user: { id: string }) {
    return this.paymentsService.getPaymentByBookingId(bookingId, user.id);
  }
}
