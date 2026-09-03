import { Controller, Post, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';

class RazorpayWebhookDto {
  razorpay_order_id!: string;
  razorpay_payment_id!: string;
  razorpay_signature!: string;
}

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':jobId/create-order')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  @ApiOperation({ summary: 'Create a payment order for a completed job' })
  createOrder(@Param('jobId', ParseUUIDPipe) jobId: string) {
    return this.paymentsService.createPaymentOrder(jobId);
  }

  @Post('webhook/razorpay')
  @ApiOperation({ summary: 'Webhook endpoint for Razorpay payment success' })
  handleWebhook(@Body() payload: RazorpayWebhookDto) {
    return this.paymentsService.handlePaymentSuccess(
      payload.razorpay_order_id,
      payload.razorpay_payment_id,
      payload.razorpay_signature,
    );
  }
}
