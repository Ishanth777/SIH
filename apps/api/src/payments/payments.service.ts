import { Injectable, Inject, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma';
import { PaymentGateway } from './interfaces/payment-gateway.interface';
import { ErrorCode } from '../common/constants';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject('PAYMENT_GATEWAY') private readonly paymentGateway: PaymentGateway,
  ) {}

  /**
   * Idempotent order creation based on jobId
   */
  async createPaymentOrder(jobId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: { payment: true },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }
    
    // In a real app, amount comes from agreedRate or base catalog rate
    const amount = job.agreedRate || 500; 

    // Idempotency: If payment already exists, return it
    if (job.payment) {
      return job.payment;
    }

    // Call payment gateway
    const order = await this.paymentGateway.createOrder(job.id, amount, 'INR');

    // Save payment record
    return this.prisma.payment.create({
      data: {
        jobId: job.id,
        amount: order.amount,
        currency: order.currency,
        status: 'PENDING',
        gatewayOrderId: order.orderId,
      },
    });
  }

  /**
   * Webhook handler for payment success
   */
  async handlePaymentSuccess(orderId: string, paymentId: string, signature: string) {
    const isValid = this.paymentGateway.verifySignature(orderId, paymentId, signature);
    if (!isValid) {
      throw new BadRequestException('Invalid payment signature');
    }

    const payment = await this.prisma.payment.findUnique({
      where: { gatewayOrderId: orderId },
    });

    if (!payment) {
      throw new NotFoundException('Payment order not found');
    }

    // Idempotency: Ignore if already completed
    if (payment.status === 'COMPLETED') {
      return payment;
    }

    this.logger.log(`Payment successful for job ${payment.jobId}`);

    return this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED',
        gatewayPaymentId: paymentId,
        gatewaySignature: signature,
      },
    });
  }
}
