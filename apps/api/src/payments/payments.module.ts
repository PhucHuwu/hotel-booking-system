import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { VNPayGateway } from './gateway/vnpay.gateway';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, VNPayGateway],
  exports: [PaymentsService],
})
export class PaymentsModule {}
