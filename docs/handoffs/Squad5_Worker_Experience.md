# Squad 5: Worker Experience & Support (The Livelihood)

## Welcome to the Team
You own the worker's digital livelihood. You handle their onboarding (KYC), skill profiling, welfare enrollments, and dispute resolutions. Your main frontend focus is the Expo mobile app.

## Your Domain Ownership
### Backend (NestJS / MinIO)
- `apps/api/src/workers/`
- `apps/api/src/customers/` (Profile management)
- `apps/api/src/welfare/`
- `apps/api/src/disputes/`

### Frontend (Expo & Next.js)
- **Expo:** Worker Profile, KYC upload screen, Welfare Enrollment UI, Ratings view.
- **Next.js:** Society Admin Dispute Resolution UI, Customer feedback/rating screen.

## Key Rules & Context
- **Rule A6:** KYC/verification documents live in object storage (MinIO/S3) ONLY. Never store documents as database blobs.
- **Rule A7 (Offline-First):** The mobile worker app must work offline. The last-fetched job list must be cached in Expo SQLite.
- **Rule S7:** DPDPA-aligned consent capture is required for worker onboarding (KYC/Aadhaar details).

## Next Immediate Tasks
1. Scaffold the Expo Mobile app using `npx create-expo-app`.
2. Implement the SQLite offline cache layer in the Expo app for worker profile data.
3. Implement the KYC document upload flow connected to the backend (which uploads to MinIO).
4. Build the Society Admin UI in Next.js for resolving disputes.
