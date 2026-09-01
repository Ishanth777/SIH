# Squad 4: Payments & Financials (The Money Flow)

## Welcome to the Team
You own the financial layer of the marketplace. Your primary responsibility is ensuring workers are paid accurately and that the cooperative society never double-charges a customer.

## Your Domain Ownership
### Backend (NestJS / Razorpay)
- `apps/api/src/payments/`

### Frontend (Next.js & Expo)
- **Next.js:** Customer Invoice and Checkout UI (Razorpay integration).
- **Expo:** Worker Earnings Dashboard (showing completed jobs, pending payouts).

## Key Rules & Context
- **Rule A5 (Idempotency):** Payment webhooks are idempotent, keyed on `jobId`. A retried webhook from Razorpay must never double-charge or double-record a payment.
- **Rule A4 (Interface):** Payments go through a `PaymentGateway` interface. We currently use `MockRazorpayAdapter`, but you will implement the real `RazorpayAdapter`.

## Next Immediate Tasks
1. Replace `MockRazorpayAdapter` in the backend with the actual Razorpay SDK implementation using Sandbox keys.
2. Build the Next.js Customer Checkout UI to trigger the Razorpay modal.
3. Build the Worker Earnings Dashboard in Expo pulling aggregated revenue data.
