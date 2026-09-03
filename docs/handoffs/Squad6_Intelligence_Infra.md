# Squad 6: Intelligence & Infrastructure (Ops & AI)

## Welcome to the Team
You are the platform engineers. You own the asynchronous messaging systems, third-party notification integrations (SMS/FCM), the DevOps pipelines, and the AI Forecasting microservice.

## Your Domain Ownership
### Backend & Infrastructure
- `apps/api/src/notifications/` (BullMQ workers)
- `apps/api/src/forecasting/` (NestJS client)
- `apps/forecasting/` (Python FastAPI microservice)
- `.github/workflows/ci.yml`
- `infra/docker/`

## Key Rules & Context
- **Rule B3:** BullMQ is used for all async work. A notification failure must never block the API request that triggered it.
- **Rule S8:** SMS templates must be DLT-registered before going live.
- **Rule E3:** Python 3.11 + Poetry is strictly enforced for the AI forecasting service.
- **Rule A3:** The platform must continue functioning normally if your AI forecasting service goes down.

## Next Immediate Tasks
1. Replace the mock loggers in `notifications.processor.ts` with the actual Firebase Cloud Messaging (FCM) Admin SDK and your SMS provider API.
2. Work on replacing the mock `/forecast` endpoint in the Python FastAPI service with the actual ML model (once trained).
3. Ensure the CI/CD pipeline (GitHub Actions) deploys the Docker stack reliably to a staging server.
