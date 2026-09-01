# Squad 1: Identity, Tenancy & Admin (Foundation)

## Welcome to the Team
You are responsible for the foundation of the platform: Authentication, Multi-Tenancy (Row-Level Security), and Admin-level management. Your work ensures that data for Cooperative Society A never leaks into Cooperative Society B.

## Your Domain Ownership
### Backend (NestJS / Prisma)
- `apps/api/src/auth/`
- `apps/api/src/federations/`
- `apps/api/src/cooperatives/`
- `apps/api/src/analytics/`
- **Database Rules:** You own `infra/docker/init-scripts/02-rls-policies.sql`.

### Frontend (Next.js)
You are responsible for building the **Admin Dashboards**:
- Federation Admin Dashboard (Analytics, Cooperative Management).
- Society Admin Dashboard (Worker Verification, local metrics).
- Web portal login / OTP flow.

## Key Rules & Context
- **Rule A1, T1, T2:** Multi-tenancy is enforced at the DB layer via Postgres Row-Level Security. Every authenticated request sets `app.current_cooperative_id` before querying. *Never bypass this.*
- **Rule E4:** You are responsible for ensuring all environment variables are strictly validated at startup.
- **Rule TS4:** The cross-tenant RLS test in `apps/api/test/rls-isolation.e2e-spec.ts` is your responsibility to maintain. It is a permanent CI gate.

## Next Immediate Tasks
1. Start building the Next.js Web App in `apps/web/`.
2. Implement the Federation Admin dashboard UI pulling data from `GET /analytics/federation/:id`.
3. Implement the Auth/OTP frontend flow connected to `POST /auth/send-otp` and `POST /auth/verify-otp`.
