import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../common/prisma';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PaymentsService (Rule A4, A5)', () => {
  let service: PaymentsService;
  let mockPrismaService: {
    job: { findUnique: jest.Mock };
    payment: { findUnique: jest.Mock; create: jest.Mock; update: jest.Mock };
  };
  let mockGateway: {
    createOrder: jest.Mock;
    verifySignature: jest.Mock;
  };

  const mockJobId = '11111111-2222-3333-4444-555555555555';

  beforeEach(async () => {
    mockPrismaService = {
      job: { findUnique: jest.fn() },
      payment: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    mockGateway = {
      createOrder: jest.fn().mockResolvedValue({
        orderId: 'order_12345',
        amount: 500,
        currency: 'INR',
      }),
      verifySignature: jest.fn().mockReturnValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: 'PAYMENT_GATEWAY', useValue: mockGateway },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  describe('createPaymentOrder (Idempotency - Rule A5)', () => {
    it('should throw 404 if job does not exist', async () => {
      mockPrismaService.job.findUnique.mockResolvedValueOnce(null);

      await expect(service.createPaymentOrder(mockJobId)).rejects.toThrow(NotFoundException);
    });

    it('should return existing payment if already created for this job (idempotent)', async () => {
      const existingPayment = {
        id: 'pay-1',
        jobId: mockJobId,
        gatewayOrderId: 'order_existing',
        amount: 500,
        status: 'PENDING',
      };

      mockPrismaService.job.findUnique.mockResolvedValueOnce({
        id: mockJobId,
        agreedRate: 500,
        payment: existingPayment,
      });

      const result = await service.createPaymentOrder(mockJobId);

      expect(result).toEqual(existingPayment);
      expect(mockGateway.createOrder).not.toHaveBeenCalled();
      expect(mockPrismaService.payment.create).not.toHaveBeenCalled();
    });

    it('should create new order via gateway when no prior payment exists', async () => {
      mockPrismaService.job.findUnique.mockResolvedValueOnce({
        id: mockJobId,
        agreedRate: 650,
        payment: null,
      });

      mockPrismaService.payment.create.mockResolvedValueOnce({
        id: 'pay-new',
        jobId: mockJobId,
        amount: 650,
        gatewayOrderId: 'order_12345',
        status: 'PENDING',
      });

      const result = await service.createPaymentOrder(mockJobId);

      expect(mockGateway.createOrder).toHaveBeenCalledWith(mockJobId, 650, 'INR');
      expect(result.status).toBe('PENDING');
    });
  });

  describe('handlePaymentSuccess (Webhook Idempotency - Rule A5, S3)', () => {
    it('should throw BadRequestException if signature is invalid', async () => {
      mockGateway.verifySignature.mockReturnValueOnce(false);

      await expect(
        service.handlePaymentSuccess('order_bad', 'pay_bad', 'invalid_sig'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if payment order does not exist', async () => {
      mockPrismaService.payment.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.handlePaymentSuccess('order_unknown', 'pay_1', 'valid_sig'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return payment unchanged if already COMPLETED (idempotent retry - Rule A5)', async () => {
      const completedPayment = {
        id: 'pay-comp',
        jobId: mockJobId,
        gatewayOrderId: 'order_12345',
        status: 'COMPLETED',
      };
      mockPrismaService.payment.findUnique.mockResolvedValueOnce(completedPayment);

      const result = await service.handlePaymentSuccess('order_12345', 'pay_1', 'valid_sig');

      expect(result).toEqual(completedPayment);
      expect(mockPrismaService.payment.update).not.toHaveBeenCalled();
    });

    it('should mark payment COMPLETED on first successful webhook', async () => {
      const pendingPayment = {
        id: 'pay-pending',
        jobId: mockJobId,
        gatewayOrderId: 'order_12345',
        status: 'PENDING',
      };
      mockPrismaService.payment.findUnique.mockResolvedValueOnce(pendingPayment);
      mockPrismaService.payment.update.mockResolvedValueOnce({
        ...pendingPayment,
        status: 'COMPLETED',
        gatewayPaymentId: 'pay_123',
      });

      const result = await service.handlePaymentSuccess('order_12345', 'pay_123', 'valid_sig');

      expect(result.status).toBe('COMPLETED');
      expect(mockPrismaService.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'COMPLETED' }),
        }),
      );
    });
  });
});
