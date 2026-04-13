import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as amqplib from "amqplib";

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: amqplib.ChannelModel | null = null;
  private channel: amqplib.Channel | null = null;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.close();
  }

  private async connect() {
    try {
      const url = this.config.get<string>(
        "RABBITMQ_URL",
        "amqp://localhost:5672",
      );
      this.connection = await amqplib.connect(url);
      this.channel = await this.connection.createChannel();

      await this.channel.assertExchange("hotel.events", "topic", {
        durable: true,
      });
      await this.channel.assertExchange("hotel.notifications", "direct", {
        durable: true,
      });

      await this.channel.assertQueue("payment.success.queue", {
        durable: true,
      });
      await this.channel.assertQueue("payment.failed.queue", { durable: true });
      await this.channel.assertQueue("notification.email.queue", {
        durable: true,
      });

      await this.channel.bindQueue(
        "payment.success.queue",
        "hotel.events",
        "payment.success",
      );
      await this.channel.bindQueue(
        "payment.failed.queue",
        "hotel.events",
        "payment.failed",
      );
      await this.channel.bindQueue(
        "notification.email.queue",
        "hotel.notifications",
        "notification.email",
      );

      this.logger.log("RabbitMQ connected");
    } catch (err) {
      this.logger.error("RabbitMQ connection failed", err);
    }
  }

  private async close() {
    try {
      await this.channel?.close();
      await this.connection?.close();
    } catch (_) {}
  }

  async publish(
    exchange: string,
    routingKey: string,
    payload: object,
  ): Promise<void> {
    if (!this.channel) {
      this.logger.warn("RabbitMQ channel not available");
      return;
    }
    const content = Buffer.from(JSON.stringify(payload));
    this.channel.publish(exchange, routingKey, content, { persistent: true });
  }

  async subscribe(
    queue: string,
    handler: (msg: amqplib.ConsumeMessage) => Promise<void>,
  ): Promise<void> {
    if (!this.channel) {
      this.logger.warn("RabbitMQ channel not available, skipping subscribe");
      return;
    }
    await this.channel.prefetch(1);
    await this.channel.consume(queue, async (msg) => {
      if (!msg) return;
      try {
        await handler(msg);
        this.channel?.ack(msg);
      } catch (err) {
        this.logger.error(`Error handling message from ${queue}`, err);
        this.channel?.nack(msg, false, false);
      }
    });
  }

  getChannel(): amqplib.Channel | null {
    return this.channel;
  }
}
