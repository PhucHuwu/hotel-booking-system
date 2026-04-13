import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

export interface VNPayParams {
  bookingId: string;
  amount: number;
  orderInfo: string;
  ipAddr: string;
}

@Injectable()
export class VNPayGateway {
  constructor(private readonly config: ConfigService) {}

  createPaymentUrl(params: VNPayParams): string {
    const tmnCode = this.config.get<string>('VNPAY_TMN_CODE', 'DEMO');
    const hashSecret = this.config.get<string>('VNPAY_HASH_SECRET', 'DEMOSECRET');
    const vnpUrl = this.config.get<string>(
      'VNPAY_URL',
      'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    );
    const returnUrl = this.config.get<string>(
      'VNPAY_RETURN_URL',
      'http://localhost:3001/payment/result',
    );

    const date = new Date();
    const createDate = this.formatDate(date);
    const expireDate = this.formatDate(new Date(date.getTime() + 15 * 60 * 1000));
    const orderId = `${params.bookingId.slice(-8)}-${Date.now()}`;

    const vnpParams: Record<string, string> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Amount: String(params.amount * 100),
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: params.orderInfo,
      vnp_OrderType: 'hotel',
      vnp_Locale: 'vn',
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: params.ipAddr,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
    };

    const sorted = Object.keys(vnpParams)
      .sort()
      .reduce((acc, k) => ({ ...acc, [k]: vnpParams[k] }), {} as Record<string, string>);

    const signData = new URLSearchParams(sorted).toString();
    const hmac = crypto.createHmac('sha512', hashSecret);
    const signature = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    sorted['vnp_SecureHash'] = signature;
    return `${vnpUrl}?${new URLSearchParams(sorted).toString()}`;
  }

  verifyWebhook(query: Record<string, string>): {
    valid: boolean;
    txnRef: string;
    amount: number;
    responseCode: string;
  } {
    const hashSecret = this.config.get<string>('VNPAY_HASH_SECRET', 'DEMOSECRET');
    const secureHash = query['vnp_SecureHash'];
    const { vnp_SecureHash: _, vnp_SecureHashType: __, ...params } = query;

    const sorted = Object.keys(params)
      .sort()
      .reduce((acc, k) => ({ ...acc, [k]: params[k] }), {} as Record<string, string>);

    const signData = new URLSearchParams(sorted).toString();
    const hmac = crypto.createHmac('sha512', hashSecret);
    const computed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    return {
      valid: computed === secureHash,
      txnRef: query['vnp_TxnRef'] ?? '',
      amount: parseInt(query['vnp_Amount'] ?? '0') / 100,
      responseCode: query['vnp_ResponseCode'] ?? '',
    };
  }

  private formatDate(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  }
}
