export interface PaymentGateway {
  createOrder(jobId: string, amount: number, currency?: string): Promise<{ orderId: string, amount: number, currency: string }>;
  verifySignature(orderId: string, paymentId: string, signature: string): boolean;
}
