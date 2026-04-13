import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import * as Handlebars from "handlebars";
import * as amqplib from "amqplib";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../common/prisma/prisma.service";
import { RabbitMQService } from "../common/rabbitmq/rabbitmq.service";

interface NotificationPayload {
  type: string;
  bookingId?: string;
  customerId?: string;
  [key: string]: any;
}

const EMAIL_TEMPLATES: Record<string, { subject: string; html: string }> = {
  "booking.confirmed": {
    subject: "Xác nhận đặt phòng thành công - {{bookingCode}}",
    html: `
      <h2>Xác nhận đặt phòng</h2>
      <p>Kính gửi {{customerName}},</p>
      <p>Đơn đặt phòng <strong>{{bookingCode}}</strong> của bạn đã được xác nhận.</p>
      <p>Check-in: {{checkIn}}</p>
      <p>Check-out: {{checkOut}}</p>
      <p>Tổng tiền: {{totalAmount}} VNĐ</p>
    `,
  },
  "checkout.completed": {
    subject: "Hóa đơn trả phòng - {{bookingCode}}",
    html: `
      <h2>Cảm ơn bạn đã sử dụng dịch vụ</h2>
      <p>Kính gửi {{customerName}},</p>
      <p>Bạn đã trả phòng thành công. Tổng hóa đơn: <strong>{{finalAmount}} VNĐ</strong></p>
    `,
  },
  "booking.cancelled": {
    subject: "Thông báo hủy đặt phòng - {{bookingCode}}",
    html: `
      <h2>Đơn đặt phòng đã bị hủy</h2>
      <p>Kính gửi {{customerName}},</p>
      <p>Đơn đặt phòng <strong>{{bookingCode}}</strong> đã bị hủy.</p>
      <p>Lý do: {{reason}}</p>
    `,
  },
  "booking.expired": {
    subject: "Đơn đặt phòng đã hết hạn - {{bookingCode}}",
    html: `
      <h2>Đơn đặt phòng đã hết hạn</h2>
      <p>Kính gửi {{customerName}},</p>
      <p>Đơn đặt phòng <strong>{{bookingCode}}</strong> đã hết hạn thanh toán và bị hủy tự động.</p>
    `,
  },
};

@Injectable()
export class NotificationsConsumer implements OnModuleInit {
  private readonly logger = new Logger(NotificationsConsumer.name);
  private transporter!: nodemailer.Transporter;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly rabbitmq: RabbitMQService,
  ) {}

  onModuleInit() {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>("SMTP_HOST", "smtp.gmail.com"),
      port: this.config.get<number>("SMTP_PORT", 587),
      secure: false,
      auth: {
        user: this.config.get<string>("SMTP_USER"),
        pass: this.config.get<string>("SMTP_PASS"),
      },
    });

    void this.startConsuming();
  }

  private async startConsuming() {
    await this.rabbitmq.subscribe("notification.email.queue", (msg) =>
      this.handleEmailNotification(msg),
    );
    this.logger.log("Notifications consumer started");
  }

  private async handleEmailNotification(msg: amqplib.ConsumeMessage) {
    const payload: NotificationPayload = JSON.parse(msg.content.toString());
    const { type, bookingId, customerId } = payload;

    const template = EMAIL_TEMPLATES[type];
    if (!template) {
      this.logger.warn(`No template for notification type: ${type}`);
      return;
    }

    let recipientEmail = "";
    let templateData: Record<string, any> = { ...payload };
    let resolvedCustomerId = customerId ?? "";

    if (bookingId) {
      const booking = await this.prisma.booking.findUnique({
        where: { id: bookingId },
        include: { customer: true },
      });
      if (booking) {
        recipientEmail = booking.customer.email;
        resolvedCustomerId = booking.customerId;
        templateData = {
          ...templateData,
          customerName: `${booking.customer.firstName} ${booking.customer.lastName}`,
          bookingCode: booking.bookingCode,
          checkIn: booking.checkIn.toLocaleDateString("vi-VN"),
          checkOut: booking.checkOut.toLocaleDateString("vi-VN"),
          totalAmount: Number(booking.totalAmount).toLocaleString("vi-VN"),
        };
      }
    }

    if (!recipientEmail) {
      this.logger.warn(`No recipient email for notification ${type}`);
      return;
    }

    const notification = await this.prisma.notification.create({
      data: {
        recipientId: resolvedCustomerId,
        email: recipientEmail,
        type,
        templateData,
      },
    });

    try {
      const subjectTemplate = Handlebars.compile(template.subject);
      const bodyTemplate = Handlebars.compile(template.html);

      await this.transporter.sendMail({
        from: this.config.get<string>("SMTP_USER"),
        to: recipientEmail,
        subject: subjectTemplate(templateData),
        html: bodyTemplate(templateData),
      });

      await this.prisma.notification.update({
        where: { id: notification.id },
        data: { sentAt: new Date(), failed: false },
      });

      this.logger.log(`Email sent to ${recipientEmail} for ${type}`);
    } catch (err) {
      this.logger.error(`Failed to send email for ${type}`, err);
      await this.prisma.notification.update({
        where: { id: notification.id },
        data: {
          failed: true,
          failReason: String(err),
          retries: { increment: 1 },
        },
      });
      throw err;
    }
  }
}
