import { Injectable, Logger } from '@nestjs/common';
import { PaymentGateway } from '../interfaces/payment-gateway.interface';
import { randomBytes } from 'crypto';

@Injectable()
export class MockRazorpayAdapter implements PaymentGateway {
  private readonly logger = new Logger(MockRazorpayAdapter.name);

  async createOrder(jobId: string, amount: number, currency: string = 'INR') {
    this.logger.log(`[MOCK RAZORPAY] Creating order for job ${jobId}, amount: ${amount}`);
    // Mock Razorpay order format: order_XYZ
    const orderId = `order_${randomBytes(8).toString('hex')}`;
    return { orderId, amount, currency };
  }

  verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    this.logger.log(`[MOCK RAZORPAY] Verifying signature for ${orderId}, ${paymentId}`);
    // For mock, any signature that says "valid_signature" is accepted, or just return true.
    return signature === 'valid_signature' || signature.length > 5;
  }
}
