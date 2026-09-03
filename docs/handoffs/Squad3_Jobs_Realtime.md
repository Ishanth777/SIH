# Squad 3: Job Lifecycle & Real-Time Ops (The Transaction)

## Welcome to the Team
You are responsible for the core transaction of the marketplace: taking a matched job and moving it reliably through its lifecycle while keeping all parties updated in real-time.

## Your Domain Ownership
### Backend (NestJS / Socket.IO / Redis)
- `apps/api/src/jobs/`
- `apps/api/src/common/gateway/` (Socket.IO EventsGateway)

### Frontend (Next.js & Expo)
- **Next.js:** Customer "Live Tracking" UI (watching a booking go from Pending to In-Progress to Complete).
- **Expo:** Worker Job Screen (UI to Accept/Reject a job, Start a job, and Mark Complete).

## Key Rules & Context
- **Rule A10:** Socket.IO uses the Redis adapter from the start. You must ensure events are properly broadcasted across multiple API instances.
- **Strict State Machine:** A job must go `PENDING` -> `ACCEPTED` -> `IN_PROGRESS` -> `COMPLETED`. Your backend module strictly enforces this.
- **Resilience:** The mobile worker app must be able to recover job state if connectivity drops and reconnects.

## Next Immediate Tasks
1. Build the Expo UI for a Worker to see an incoming Job Offer (listening to `job:offer` WebSocket events).
2. Build the Next.js UI for the Customer to see their Job Status (listening to `job:status` WebSocket events).
3. Ensure Socket.IO reconnect logic is robust on both frontends.
