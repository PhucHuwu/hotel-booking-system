import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as amqplib from 'amqplib';
import { RabbitMQService } from '../../common/rabbitmq/rabbitmq.service';
import { BookingsService } from '../bookings.service';

@Injectable()
export class BookingSaga implements OnModuleInit {
  private readonly logger = new Logger(BookingSaga.name);

  constructor(
    private readonly rabbitmq: RabbitMQService,
    private readonly bookingsService: BookingsService,
  ) {}

  async onModuleInit() {
    await this.rabbitmq.subscribe('payment.success.queue', (msg) => this.handlePaymentSuccess(msg));
    await this.rabbitmq.subscribe('payment.failed.queue', (msg) => this.handlePaymentFailed(msg));
    this.logger.log('BookingSaga consumers started');
  }

  private async handlePaymentSuccess(msg: amqplib.ConsumeMessage) {
    const data = JSON.parse(msg.content.toString());
    const { bookingId } = data;
    this.logger.log(`Payment success for booking ${bookingId}`);

    try {
      await this.bookingsService.confirmBooking(bookingId);
      this.logger.log(`Booking ${bookingId} confirmed`);
    } catch (err) {
      this.logger.error(`Failed to confirm booking ${bookingId}`, err);
      throw err;
    }
  }

  private async handlePaymentFailed(msg: amqplib.ConsumeMessage) {
    const data = JSON.parse(msg.content.toString());
    const { bookingId, customerId, reason } = data;
    this.logger.log(`Payment failed for booking ${bookingId}`);

    try {
      await this.bookingsService.expireBooking(bookingId);
      this.logger.log(`Booking ${bookingId} cancelled due to payment failure`);
    } catch (err) {
      this.logger.error(`Failed to cancel booking ${bookingId} after payment failure`, err);
      throw err;
    }
  }
}
