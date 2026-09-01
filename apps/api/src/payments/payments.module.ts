import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { MockRazorpayAdapter } from './adapters/razorpay.adapter';

@Module({
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    {
      provide: 'PAYMENT_GATEWAY',
      useClass: MockRazorpayAdapter, // Swappable to real RazorpayAdapter later
    },
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
