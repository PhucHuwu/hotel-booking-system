import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { EventsService } from "../common/events/events.service";
import { VNPayGateway } from "./gateway/vnpay.gateway";
import { PaymentMethod, PaymentStatus, BookingStatus } from "@prisma/client";

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsService,
    private readonly vnpay: VNPayGateway,
  ) {}

  async initiatePayment(
    bookingId: string,
    customerId: string,
    method: PaymentMethod,
    ipAddr: string,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException("Đơn đặt phòng không tồn tại");
    if (booking.customerId !== customerId) {
      throw new BadRequestException("Không có quyền thanh toán đơn này");
    }
    if (booking.status !== BookingStatus.PENDING_PAYMENT) {
      throw new BadRequestException("Đơn không ở trạng thái chờ thanh toán");
    }
    if (new Date() > booking.paymentDeadline) {
      throw new BadRequestException("Đơn đã hết hạn thanh toán");
    }

    let payment = await this.prisma.payment.findUnique({
      where: { bookingId },
    });
    if (payment && payment.status === PaymentStatus.COMPLETED) {
      throw new ConflictException("Đơn đã được thanh toán");
    }

    let gatewayUrl: string | undefined;
    if (method === PaymentMethod.VNPAY) {
      gatewayUrl = this.vnpay.createPaymentUrl({
        bookingId,
        amount: Number(booking.totalAmount),
        orderInfo: `Thanh toan dat phong ${booking.bookingCode}`,
        ipAddr,
      });
    }

    if (!payment) {
      payment = await this.prisma.payment.create({
        data: {
          bookingId,
          customerId,
          method,
          amount: booking.totalAmount,
          status: PaymentStatus.PROCESSING,
          gatewayUrl,
        },
      });
    } else {
      payment = await this.prisma.payment.update({
        where: { bookingId },
        data: { status: PaymentStatus.PROCESSING, method, gatewayUrl },
      });
    }

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.PAYING },
    });

    return { payment, gatewayUrl };
  }

  async handleWebhook(query: Record<string, string>) {
    const { valid, txnRef, amount, responseCode } =
      this.vnpay.verifyWebhook(query);

    if (!valid) {
      return { code: "97", message: "Invalid signature" };
    }

    const bookingCodePart = txnRef.split("-")[0];
    const booking = await this.prisma.booking.findFirst({
      where: { bookingCode: { endsWith: bookingCodePart } },
    });

    if (!booking) {
      return { code: "01", message: "Order not found" };
    }

    const gatewayTransactionId = query["vnp_TransactionNo"];

    const existingPayment = await this.prisma.payment.findUnique({
      where: { bookingId: booking.id },
    });

    if (existingPayment?.gatewayTransactionId === gatewayTransactionId) {
      return { code: "00", message: "Already processed" };
    }

    const isSuccess = responseCode === "00";

    await this.prisma.payment.update({
      where: { bookingId: booking.id },
      data: {
        status: isSuccess ? PaymentStatus.COMPLETED : PaymentStatus.FAILED,
        gatewayTransactionId,
        paidAt: isSuccess ? new Date() : undefined,
        failureReason: isSuccess ? undefined : `VNPay code: ${responseCode}`,
      },
    });

    if (isSuccess) {
      await this.events.emit("payment.success", {
        bookingId: booking.id,
        amount,
        gatewayTransactionId,
      });
    } else {
      await this.events.emit("payment.failed", {
        bookingId: booking.id,
        responseCode,
        gatewayTransactionId,
      });
    }

    return { code: "00", message: "Confirmed" };
  }

  async getPaymentByBookingId(bookingId: string, userId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { bookingId },
      include: { booking: true },
    });
    if (!payment)
      throw new NotFoundException("Thông tin thanh toán không tồn tại");
    if (payment.customerId !== userId) {
      throw new BadRequestException("Không có quyền xem thông tin này");
    }
    return payment;
  }
}
