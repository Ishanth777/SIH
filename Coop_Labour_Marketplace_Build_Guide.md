# Cooperative Labour Marketplace — Zero-to-Production Build Guide

Project: cooperative-owned digital service marketplace connecting Labour Cooperative Federation / Society workers (electricians, plumbers, carpenters, painters, domestic helpers, caregivers, drivers, gardeners, cleaners, technicians) with households and institutions, with verification, fair-wage protection, welfare/insurance, and federation administration.

**Stack locked in (one choice per decision, no options presented):**
Next.js 14 (App Router, TypeScript) for web · NestJS (TypeScript) for backend · Expo (React Native) for the worker mobile app · PostgreSQL 15 + PostGIS for data + geo · Redis + BullMQ for queues/real-time · Prisma as ORM · Razorpay for UPI-first payments · MinIO (S3-compatible) for documents · a small Python/FastAPI service for AI demand forecasting · Docker + GitHub Actions for CI/CD.

Follow the steps in order. Each step has **Do / Why / Verify**, and a **Git checkpoint** where relevant.

---

## STEP 1 — Requirements & Planning

**Do:**
- Freeze the pilot scope in writing before touching code: 1 Federation, 3–5 Societies, 4 service categories for v1 (electrician, plumber, cleaner, caregiver), web app for customers + federation/society admins, Android app for workers.
- List the 6 actors and their one-sentence core job: Ministry/Federation viewer, Federation Admin, Society Admin, Worker, Customer, Dispute/Support Officer.
- Lock these non-negotiable architecture decisions now, since they're expensive to retrofit later:
  - Multi-tenancy: Federation → Cooperative Society → Worker hierarchy, enforced at the database level (Postgres Row-Level Security), not just in application code.
  - Geo-matching: PostGIS from day one, not "add geo later."
  - Payments: UPI-first via Razorpay, with a payment-gateway interface so the gateway is swappable.
  - Matching: a deterministic rules-based fallback matcher must exist independently of the AI layer — AI augments, never gatekeeps, worker assignment.
- Write down out-of-scope items explicitly (e.g., multi-language voice support, iOS app, dynamic pricing) so scope creep is visible when it happens.

**Why:** Every schema, auth, and matching decision below depends on the tenancy model and actor list being fixed first.

**Verify before moving on:** You can state, in one sentence each, what a Worker, a Society Admin, and a Customer can do in v1, and name the one thing you're deliberately NOT building yet.

---

## STEP 2 — Tech Stack Selection

**Do:** Adopt this stack as final (rationale, not options):

| Layer | Choice | Why this one |
|---|---|---|
| Backend framework | NestJS (TypeScript) | Opinionated module structure maps cleanly to the domain modules below; built-in DI, guards, pipes reduce boilerplate for auth/validation. |
| Web frontend | Next.js 14, App Router | SSR for SEO on public service pages, React Server Components reduce client bundle for admin dashboards. |
| Mobile (worker app) | Expo (React Native, TypeScript) | Single codebase, OTA updates for fast pilot iteration, mature push-notification and offline-storage libraries. |
| ORM | Prisma | Type-safe queries, first-class migration tooling, works cleanly with raw SQL for PostGIS/RLS where needed. |
| Database | PostgreSQL 15 + PostGIS | Relational integrity for tenancy + native geo-spatial queries (ST_DWithin) for worker matching. |
| Cache/Queue | Redis + BullMQ | Job queue for matching/notifications/payments retries; also backs Socket.IO's adapter for multi-instance real-time. |
| Realtime | Socket.IO | Push job offers/status changes to worker app and live booking status to customer web app. |
| Payments | Razorpay | UPI-first, strong India payment-method coverage, webhook-based reconciliation. |
| Object storage | MinIO (local) → S3-compatible bucket (prod) | KYC docs/certificates never go in the DB as blobs. |
| AI/Forecasting | Python + FastAPI microservice (Prophet/statsmodels) | Time-series forecasting libraries are Python-native; isolating it as a microservice keeps the Node stack free of Python deps. |
| CI/CD | GitHub Actions | Free for private repos at pilot scale, integrates with Trivy/audit tooling used below. |
| Containerization | Docker | Identical local/prod runtime; required for the empanelled-cloud deployment target. |

**Why:** Deciding this once, in writing, prevents "which ORM should we use" debates resurfacing mid-build.

**Verify:** You have a one-page table (the above) you can hand to a new team member without re-litigating choices.

---

## STEP 3 — Local Environment Setup

**Do:**
```bash
# Node via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20 && nvm use 20

# Docker Desktop / Docker Engine — install per your OS from docker.com

# Python for the forecasting microservice
# (use pyenv or your OS package manager to install Python 3.11)

# Global CLIs
npm i -g @nestjs/cli pnpm
pip install --user pipx && pipx install poetry
```

**Why:** Pinning Node 20 and Python 3.11 now avoids "works on my machine" drift once contributors join.

**Verify:** `node -v` → v20.x, `docker -v`, `pnpm -v`, `nest -v`, `python3 --version` → 3.11.x, `poetry --version` all resolve without error.

---

## STEP 4 — Project Initialization (Monorepo)

**Do:**
```bash
mkdir coop-marketplace && cd coop-marketplace
git init
pnpm init
```
Create `pnpm-workspace.yaml`:
```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "services/*"
```

**Why:** A single monorepo with workspace packages lets `shared-types` (DTOs/enums) be imported by api, web, and mobile without publishing a private npm package.

**Git checkpoint:**
```bash
echo -e "node_modules\n.env\ndist\n.next\n.expo\n__pycache__\n.venv" > .gitignore
git add . && git commit -m "chore: repo init"
```

**Verify:** `pnpm -v` runs at repo root without error; `git log` shows the first commit.

---

## STEP 5 — Folder Structure

**Do:** Create this structure now (empty directories are fine — they get filled in later steps):
```
coop-marketplace/
  apps/
    api/            # NestJS backend
    web/             # Next.js customer + admin web app
    mobile/          # Expo worker app
  services/
    forecasting/     # Python/FastAPI AI demand-forecasting microservice
  packages/
    shared-types/    # DTOs/enums shared across api + web + mobile
  infra/
    docker/           # docker-compose for local infra
    k6/               # load-test scripts
  .github/workflows/
```

**Git checkpoint:**
```bash
git add . && git commit -m "chore: monorepo folder skeleton"
```

**Verify:** `tree -L 2` (or `find . -maxdepth 2`) matches the structure above.

---

## STEP 6 — Database Setup

### 6a. Local infrastructure (Docker Compose)

**Do:** create `infra/docker/docker-compose.yml`:
```yaml
version: "3.9"
services:
  postgres:
    image: postgis/postgis:15-3.4
    environment:
      POSTGRES_USER: coop
      POSTGRES_PASSWORD: coop_dev_pw
      POSTGRES_DB: coop_marketplace
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]
  redis:
    image: redis:7
    ports: ["6379:6379"]
  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports: ["9000:9000", "9001:9001"]
    volumes: ["miniodata:/data"]
  pgbouncer:
    image: edoburu/pgbouncer
    environment:
      DATABASE_URL: postgres://coop:coop_dev_pw@postgres:5432/coop_marketplace
    ports: ["6432:6432"]
    depends_on: [postgres]
volumes:
  pgdata:
  miniodata:
```
```bash
cd infra/docker && docker compose up -d
```

**Verify:** `docker ps` shows 4 healthy containers; `psql postgresql://coop:coop_dev_pw@localhost:5432/coop_marketplace -c '\dt'` connects (empty table list is fine).

### 6b. Schema — tenancy backbone first

**Do:** `cd apps/api && npx prisma init`. Set `apps/api/.env`:
```
DATABASE_URL="postgresql://coop:coop_dev_pw@localhost:6432/coop_marketplace"
```
Model the tenancy + core domain entities in `prisma/schema.prisma` (expand per-module fields in Step 7):
```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql", url = env("DATABASE_URL") }

model Federation {
  id           String        @id @default(uuid())
  name         String
  cooperatives Cooperative[]
  createdAt    DateTime      @default(now())
}

model Cooperative {
  id           String     @id @default(uuid())
  name         String
  federationId String
  federation   Federation @relation(fields: [federationId], references: [id])
  workers      Worker[]
  createdAt    DateTime   @default(now())
}

model Worker {
  id            String      @id @default(uuid())
  cooperativeId String
  cooperative   Cooperative @relation(fields: [cooperativeId], references: [id])
  name          String
  phone         String      @unique
  skills        String[]
  latitude      Float?
  longitude     Float?
  verified      Boolean     @default(false)
  createdAt     DateTime    @default(now())
}

model User {
  id            String   @id @default(uuid())
  phone         String   @unique
  passwordHash  String
  role          String   // federation_admin, society_admin, worker, customer, dispute_officer, ministry_viewer
  cooperativeId String?
  federationId  String?
  createdAt     DateTime @default(now())
}
```
```bash
npx prisma migrate dev --name init_tenancy
```

**Do:** enable PostGIS + Row-Level Security via a raw SQL migration:
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
ALTER TABLE "Worker" ADD COLUMN geom geography(Point, 4326);
CREATE INDEX worker_geom_idx ON "Worker" USING GIST (geom);

ALTER TABLE "Worker" ENABLE ROW LEVEL SECURITY;
CREATE POLICY worker_isolation ON "Worker"
  USING (cooperativeId = current_setting('app.current_cooperative_id')::text);
```
```bash
npx prisma db execute --file ./prisma/rls.sql
```

**Why:** Enforcing tenant isolation at the database layer means a bug in application-layer filtering can't leak one cooperative's workers/customers into another's view — critical for a multi-federation platform.

**Git checkpoint:** `git add . && git commit -m "feat(db): tenancy schema + postgis + row-level security"`

**Verify:** `npx prisma studio` shows the tables; `\d "Worker"` in psql confirms `worker_geom_idx` exists; write and run a one-off script that sets `app.current_cooperative_id` to cooperative A and confirms querying `Worker` never returns cooperative B's rows.

---

## STEP 7 — Backend Development

**Do:**
```bash
cd apps/api
nest new . --package-manager pnpm --skip-git
pnpm add @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt \
  @prisma/client prisma bcrypt class-validator class-transformer \
  @nestjs/swagger bullmq @nestjs/bullmq ioredis socket.io \
  @nestjs/websockets @nestjs/platform-socket.io @nestjs/throttler
pnpm add -D @types/passport-jwt @types/bcrypt
```

**Do:** scaffold the domain modules (empty controllers/services now, wired module-by-module in Step 8):
```bash
nest g module auth && nest g module federations && nest g module cooperatives \
&& nest g module workers && nest g module customers && nest g module services-catalog \
&& nest g module requests && nest g module matching && nest g module jobs \
&& nest g module payments && nest g module welfare && nest g module disputes \
&& nest g module notifications && nest g module forecasting && nest g module analytics
```

**Feature build order (do not skip ahead):**
1. `auth` — phone+OTP and password login, JWT issuance (Step 10).
2. `federations` / `cooperatives` — tenancy CRUD, since everything else hangs off this.
3. `workers` — registration, skill profiling, verification/KYC status.
4. `customers` — registration, address book.
5. `services-catalog` — the fixed list of service categories/subcategories (electrician, plumber, etc.), each with a base rate band for fair-wage enforcement.
6. `requests` — customer creates a service request (scheduled or emergency).
7. `matching` — deterministic nearest-verified-worker-by-skill matcher (PostGIS `ST_DWithin`), independent of AI.
8. `jobs` — accept/reject/in-progress/complete lifecycle, tied to a `request`.
9. `payments` — invoicing + Razorpay integration, idempotent by `jobId`.
10. `welfare` — insurance/welfare scheme enrollment records per worker.
11. `disputes` — rating disputes, payment disputes, escalation to a Dispute Officer role.
12. `notifications` — SMS/push fan-out (Step 11).
13. `forecasting` — calls the Python microservice (Step 11) and stores results for the admin dashboard.
14. `analytics` — federation admin dashboard aggregates (bookings, revenue, worker utilization).

**Why this order:** tenancy and identity (1–4) must exist before anything that references a worker or customer; the deterministic matcher (7) must ship before AI (13) so the platform is never dependent on an unproven model for core function.

**Verify:** `pnpm start:dev` inside `apps/api` boots Nest on port 3000 with no errors; Swagger UI (`/api/docs`, wired via `@nestjs/swagger`) loads and lists all 14 modules' (empty) route groups.

**Git checkpoint:** `git add . && git commit -m "feat(api): nest scaffold + domain modules"`

---

## STEP 8 — API Development

**Do, per module, in the order listed in Step 7:**
- Define request/response DTOs with `class-validator` decorators in each module's `dto/` folder; mirror each DTO's shape in `packages/shared-types` so web/mobile import the same types instead of redefining them.
- Implement controllers as thin — validation via DTO, delegate to service, return typed response. Business logic lives in services, not controllers.
- Add Swagger decorators (`@ApiTags`, `@ApiOperation`, `@ApiResponse`) as you go, not retroactively — this keeps `/api/docs` usable for the frontend team from day one.
- Key endpoints to build first (matches the feature order above):
  - `POST /auth/otp/request`, `POST /auth/otp/verify`, `POST /auth/login`
  - `POST /federations`, `POST /cooperatives`, `GET /cooperatives/:id/workers`
  - `POST /workers`, `POST /workers/:id/verify`, `PATCH /workers/:id/skills`
  - `POST /requests`, `GET /requests/:id`
  - `POST /matching/:requestId/dispatch` (runs deterministic matcher, enqueues offers)
  - `POST /jobs/:id/accept`, `POST /jobs/:id/complete`
  - `POST /payments/:jobId/charge`, `POST /payments/webhook` (Razorpay webhook, signature-verified)
- Test each endpoint with Supertest as it's built (see Step 12) — do not defer this to a later "testing phase."

**Why:** Building thin controllers + typed DTOs shared via `shared-types` prevents the classic problem of frontend and backend silently drifting on field names/types.

**Verify (per module, before moving to the next one):** `curl` or the Swagger UI can complete the module's core flow end-to-end against the local Postgres from Step 6; Supertest suite for that module is green.

**Git checkpoint (per module):** `git commit -m "feat(api): <module> endpoints + tests"`

---

## STEP 9 — Frontend Development

### 9a. Web app (Next.js — customer + federation/society admin)

**Do:**
```bash
cd apps/web
npx create-next-app@latest . --typescript --tailwind --app
pnpm add @tanstack/react-query axios socket.io-client react-hook-form zod \
  @hookform/resolvers next-intl
pnpm dlx shadcn@latest init
```
Build screens in this order: customer service-request form → booking status/tracking page (Socket.IO live updates) → payment/invoice view → federation admin worker-verification queue → society admin dashboard (bookings, worker utilization from `analytics`) → ratings/feedback screen.
Wire `next-intl` with at least English + one regional language locale file from the start — retrofitting i18n after screens are built means re-touching every component.

**Verify:** `pnpm dev` serves the app; switching the locale query param renders the same screen in both configured languages; a full booking flows end-to-end against the local API from Step 8.

### 9b. Mobile app (Expo — worker)

**Do:**
```bash
cd apps/mobile
npx create-expo-app . --template blank-typescript
npx expo install expo-sqlite expo-location expo-notifications expo-localization
pnpm add @tanstack/react-query axios socket.io-client i18next react-i18next
```
Build screens in order: availability toggle → job offer accept/reject (push via FCM) → navigation link-out to the job address → earnings dashboard → welfare enrollment screen. Use Expo SQLite to cache the last-fetched job list for offline/rural-connectivity resilience — this is required, not optional, per the problem statement's rural-worker context.

**Verify:** enable airplane mode, confirm the last-fetched job list still renders from the SQLite cache; re-enable network and confirm it re-syncs against the API.

**Git checkpoint:** `git commit -m "feat(web,mobile): core customer, admin, and worker flows"`

---

## STEP 10 — Authentication / Authorization

**Do:**
- Primary login: phone number + OTP (via SMS gateway) for workers and customers; email/password acceptable for federation/society admin and dispute-officer roles.
- Issue a short-lived JWT access token (15 min) + a longer-lived refresh token (7 days), both signed with separate secrets (`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`).
- Implement RBAC via a Nest `RolesGuard` reading a `@Roles(...)` decorator on each route, checked against the `role` field on `User` (`federation_admin`, `society_admin`, `worker`, `customer`, `dispute_officer`, `ministry_viewer`).
- On every authenticated request, set the Postgres session variable `app.current_cooperative_id` from the JWT claim before running queries, so the Row-Level Security policy from Step 6 actually takes effect — this is the enforcement point, don't skip it.
- Rate-limit the OTP-request endpoint specifically (separate, tighter limit than general API throttling) to prevent SMS-bombing abuse.

**Why:** RBAC alone is not tenant isolation — without setting the session variable per-request, RLS policies never activate and cross-tenant leakage becomes possible again.

**Verify:** a token minted for a Society-A admin cannot read Society-B's workers even by directly hitting `GET /cooperatives/:societyBId/workers` with a valid-but-wrong-tenant token (should 403, not 200-with-empty-list — confirm it's an authorization failure, not a silent empty result).

**Git checkpoint:** `git commit -m "feat(auth): OTP+JWT auth, RBAC guard, RLS session binding"`

---

## STEP 11 — Integration

**Do, in this order:**
1. **Payments (Razorpay):** implement a `PaymentGateway` interface in the `payments` module with a `RazorpayAdapter` implementation, so the gateway is swappable later. Handle the webhook with signature verification and idempotency keyed on `jobId` — a retried webhook must never double-charge or double-record.
2. **Notifications (SMS + push):** wire an SMS gateway with DLT-registered sender templates (mandatory for transactional SMS in India) for OTPs and booking confirmations; wire FCM for worker-app push (job offers) via `notifications` module, consumed as BullMQ jobs so a notification failure doesn't block the API request that triggered it.
3. **Geo-matching:** confirm `matching` module's `ST_DWithin` query returns verified, available, correct-skill workers ordered by distance; this must work standalone before AI is layered on.
4. **AI demand forecasting microservice:**
   ```bash
   cd services/forecasting
   poetry init && poetry add fastapi uvicorn prophet pandas
   ```
   Expose one endpoint, e.g. `POST /forecast` accepting historical booking counts per (cooperative, service category, day) and returning a 7/30-day demand forecast; the NestJS `forecasting` module calls this over internal HTTP and stores results for the admin dashboard's workforce-allocation suggestions. Keep this service read-only and advisory — it must never auto-assign workers, only suggest staffing levels to a Society Admin.
5. **Real-time (Socket.IO):** wire the Redis adapter (`@socket.io/redis-adapter`) so job-offer and booking-status events reach connected clients correctly once you run more than one API instance (needed for Step 20's horizontal-scaling check).

**Why:** Sequencing payments and notifications before AI ensures the transactional core works before adding a probabilistic, non-critical-path component.

**Verify:** a full path — customer books → matcher dispatches to nearest verified worker → worker accepts on mobile → job completes → payment charges → invoice generates → rating requested — runs end-to-end locally without manual DB edits.

**Git checkpoint:** `git commit -m "feat: payments, notifications, geo-matching, forecasting service integrated"`

---

## STEP 12 — Testing (build this alongside every step above, not just now)

**Do:** by this point you should already have, per module as it was built:
- Jest unit tests per service (business logic, especially the matcher's ranking logic and payment idempotency).
- Supertest integration tests per controller.
- A cross-tenant RLS regression test (from Step 6/10) — this becomes a permanent CI gate, never delete it.
- Playwright E2E covering the full web booking journey (customer books → admin verifies worker → job completes).
- A Detox or Playwright-mobile smoke test for the Expo app's accept/reject flow.
- A contract test around the `matching` ↔ `payments` boundary (a job must not be payable until it's marked complete).

```bash
pnpm --filter api test
pnpm --filter web test:e2e
```

**Verify:** all suites are green locally before Step 16 wires them into CI.

---

## STEP 13 — Error Handling & Validation

**Do:**
- Global `ValidationPipe` in Nest with `{ whitelist: true, forbidNonWhitelisted: true }` so unexpected fields are rejected, not silently dropped.
- A global `HttpExceptionFilter` returning a consistent shape: `{ statusCode, message, errorCode }`, with `errorCode` being a stable machine-readable string (e.g. `WORKER_NOT_VERIFIED`) the frontend can branch on without parsing English text.
- Mirror every backend DTO with a matching `react-hook-form` + `zod` schema on the web app, and equivalent validation on mobile forms, so invalid input never reaches the API in the first place.
- Log unhandled exceptions with request-correlation IDs (needed for the observability setup in Step 19).

**Verify:** send a malformed booking payload — API returns 400 with field-level errors, not a 500; trigger an unverified-worker job-accept attempt and confirm it returns the specific `errorCode`, not a generic failure.

**Git checkpoint:** `git commit -m "feat: global validation pipe + exception filter + shared zod schemas"`

---

## STEP 14 — Security

**Do:**
- TLS everywhere, enforced at the ingress (Step 19), including internal service-to-service calls where the platform allows it.
- `@nestjs/throttler` backed by Redis for general rate limiting, plus the tighter OTP-specific limit from Step 10.
- Store KYC/verification documents only in object storage (MinIO/S3), never as DB blobs; rely on managed-disk or bucket-level encryption at rest.
- Add `pnpm audit` (Node) and `poetry export | pip-audit` (Python service) as required CI checks; add a Trivy container-image scan for the API's Docker image.
- Re-run the cross-tenant RLS test from Step 6/12 as a permanent CI gate — this is the single most important regression to never let slip.
- Verify the Razorpay webhook handler rejects requests with an invalid signature.

**Verify:** `pnpm audit` shows no high/critical vulnerabilities; the throttler blocks a rapid-fire OTP/login loop; a forged webhook payload (bad signature) is rejected with 401.

**Git checkpoint:** `git commit -m "feat(security): rate limiting, audit gates, RLS regression test, webhook signature check"`

---

## STEP 15 — Performance Optimization

**Do:**
- Add composite/GIST indexes confirmed via `EXPLAIN ANALYZE` on the hot paths: worker geo-lookup (already indexed in Step 6), `requests` by cooperative+status, `jobs` by worker+status.
- Put PgBouncer (already in the Step 6 compose file) in front of Postgres in production too, to survive connection-pool exhaustion under load.
- Cache read-heavy, slow-changing data (service-catalog list, cooperative list) in Redis with a short TTL rather than hitting Postgres on every request.
- Paginate every list endpoint (`workers`, `requests`, `jobs`) — never return unbounded result sets to the admin dashboards.
- Load-test with k6 against the target from the problem statement's expected pilot-to-production scale: start at 100 concurrent users locally, confirm p95 latency on `matching` and `payments` endpoints stays under ~300ms before scaling the test further in Step 20.

**Verify:** `EXPLAIN ANALYZE` on the worker geo-matching query shows the GIST index is used (not a sequential scan); a local k6 run at 100 VUs completes with no failed requests and acceptable p95 latency.

**Git checkpoint:** `git commit -m "perf: indexes verified, redis caching, pagination, baseline k6 load test"`

---

## STEP 16 — Git / GitHub Setup

**Do:**
```bash
gh repo create coop-marketplace --private --source=. --push
```
- Adopt a simple branching model: `main` (protected, deploy-triggering) ← PRs from `feature/*` branches, one PR per module/feature from the build order above.
- Require the CI workflow (Step 17) to pass before merge; require at least one review if you have a second contributor.
- Tag a release (`git tag v0.1.0-pilot`) once Steps 1–15 are complete and all suites are green — this becomes your rollback point before deployment.

**Verify:** branch protection on `main` is enabled in GitHub repo settings; a PR cannot merge with a failing CI check.

---

## STEP 17 — CI/CD (GitHub Actions)

**Do:** create `.github/workflows/ci.yml`:
```yaml
name: CI
on: [push, pull_request]
jobs:
  build-test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgis/postgis:15-3.4
        env: { POSTGRES_PASSWORD: coop_dev_pw, POSTGRES_DB: coop_marketplace, POSTGRES_USER: coop }
        ports: ["5432:5432"]
      redis:
        image: redis:7
        ports: ["6379:6379"]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install
      - run: pnpm --filter api prisma migrate deploy
      - run: pnpm --filter api test
      - run: pnpm --filter web build
      - run: pnpm audit --audit-level=high
      - name: Trivy scan
        uses: aquasecurity/trivy-action@master
        with: { image-ref: 'coop-marketplace-api:latest' }
```

**Why:** running migrations + tests against a real Postgres/Redis service container (not mocks) in CI catches the RLS and PostGIS behavior that unit tests alone would miss.

**Verify:** push a feature branch, confirm the Action runs green in GitHub's Actions tab end-to-end.

**Git checkpoint:** `git commit -m "ci: github actions pipeline — test, migrate, audit, trivy"`

---

## STEP 18 — Environment Variables / Configuration

**Do:** create `.env.example` per app (never commit a real `.env`):
```
# apps/api/.env.example
DATABASE_URL=
REDIS_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
MINIO_ENDPOINT=
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
FCM_SERVER_KEY=
SMS_GATEWAY_DLT_KEY=
FORECASTING_SERVICE_URL=
```
Load config via `@nestjs/config` with a `zod` or `Joi` validation schema so the app refuses to boot if a required secret is missing, rather than failing on the first request that needs it.

**Verify:** removing a required var from `.env` causes the app to fail fast at startup with a clear error naming the missing variable.

---

## STEP 19 — Build Process

**Do:**
```bash
# API
cd apps/api && pnpm build            # -> dist/
# Web
cd apps/web && pnpm build            # -> .next/
# Forecasting service
cd services/forecasting && poetry build
# Mobile (production build)
cd apps/mobile && eas build --platform android --profile production
```
Write a multi-stage `Dockerfile` for the API (`node:20-alpine` runtime stage) and one for the forecasting service (`python:3.11-slim`). Skip a web Dockerfile if deploying to Vercel (Step 20).

**Verify:** `docker build -t coop-api:latest apps/api && docker run -p 3000:3000 coop-api:latest` serves `/health` with a 200.

---

## STEP 20 — Deployment

Deploy to an India-region cloud (government-empanelled cloud such as MeghRaj/NIC if required for this pilot, or any equivalent India-region VM/cloud set — the architecture below is identical either way).

- **Database:** managed PostgreSQL 15 with PostGIS enabled (or self-managed VM using the Step 6 compose config, scaled up). Enable automated daily backups + point-in-time recovery.
- **Redis:** managed Redis or a dedicated VM with AOF persistence enabled — BullMQ jobs must survive restarts.
- **Object storage:** move from MinIO to the target S3-compatible bucket; store credentials in a secrets manager, never in a deployed `.env` file.
- **Backend (NestJS):** deploy the Step 19 Docker image to your container host, behind Nginx/Caddy or a managed load balancer, with **no session affinity** (the API is stateless — auth is JWT-based). Inject env vars via the platform's secret manager.
- **Frontend (Next.js):** deploy to Vercel (fastest path) or self-host the Dockerfile behind Caddy/Nginx if it must stay on empanelled infra. Point `NEXT_PUBLIC_API_URL` at the backend's public URL.
- **Forecasting service:** deploy as its own small container next to the API, reachable only on the internal network — it should never be internet-facing.
- **Mobile:** `eas submit --platform android` to the Play Store's internal testing track for pilot Societies.
- **CDN/Edge:** Cloudflare (or an empanelment-approved equivalent) in front of the web app.
- **DNS/TLS:** `api.yourdomain.in` → backend LB, `app.yourdomain.in` → frontend; enforce TLS via Let's Encrypt (Caddy) or the platform's managed certs.
- **Migrations in production:**
  ```bash
  DATABASE_URL=<prod-url> pnpm --filter api prisma migrate deploy
  ```
- **Observability:** deploy Prometheus + Grafana + Loki (self-hosted via Docker Compose on a monitoring VM, or managed equivalents), with OpenTelemetry exporters wired from the API.

**Compliance gate before public go-live:**
- Independent security audit / VAPT, resolved to no unresolved critical/high findings.
- Confirm DPDPA-aligned consent capture and a retention/deletion policy are live on registration flows, not just documented.
- Confirm SMS templates are DLT-registered before any transactional SMS goes live in production.

**Verify:** the full booking journey (customer books → worker accepts → job completes → payment charges → rating submitted) works against production URLs; TLS padlock present on both domains; Grafana shows live request metrics; Loki shows structured logs with correlation IDs; a live/test-mode Razorpay payment completes as appropriate for the pilot stage.

**Git checkpoint:** `git tag v1.0.0-prod && git push --tags`

---

## STEP 21 — Post-Deployment Verification

- [ ] Load test with k6 at pilot-scale target (start at 1,000+ concurrent users / 10,000+ requests/day and confirm the system holds).
- [ ] Confirm horizontal scaling: add a second API instance, verify Socket.IO events (job offers, status updates) still reach all connected clients via the Redis adapter.
- [ ] Confirm PgBouncer pool sizing and a Postgres read replica (if provisioned) hold up under the load test.
- [ ] Confirm BullMQ dead-letter queues are monitored, with an alert if DLQ depth > 0.
- [ ] Re-run the cross-tenant RLS isolation test against production data as a read-only check.
- [ ] Perform one actual test restore from backup — "backups are running" is not sufficient evidence they work.
- [ ] Confirm the deterministic fallback matcher still functions correctly if the forecasting/AI service is stopped entirely.

---

## Final Project Structure

```
coop-marketplace/
  apps/
    api/          (NestJS: auth, federations, cooperatives, workers, customers,
                   services-catalog, requests, matching, jobs, payments, welfare,
                   disputes, notifications, forecasting, analytics)
    web/          (Next.js: customer app + federation/society admin dashboard, i18n)
    mobile/       (Expo: worker app — offline cache, push, i18n)
  services/
    forecasting/  (FastAPI + Prophet demand-forecasting microservice)
  packages/
    shared-types/ (DTOs/enums shared across api + web + mobile)
  infra/
    docker/       (local compose: postgres+postgis, redis, minio, pgbouncer)
    k6/           (load-test scripts)
  .github/workflows/ci.yml
```

## Final Deployment Checklist

- [ ] All domain APIs (Step 8) pass integration tests in CI
- [ ] Cross-tenant RLS isolation test is a permanent CI gate
- [ ] Deterministic fallback matcher verified independently of the AI forecasting layer
- [ ] Emergency/on-demand booking path tested end-to-end
- [ ] Payments are idempotent and the gateway is abstracted behind an interface
- [ ] KYC documents live in object storage only, never as DB blobs
- [ ] TLS enforced end-to-end, including internal service calls
- [ ] Secrets live in a secrets manager, not in committed `.env` files
- [ ] DPDPA consent capture + retention policy is live, not just documented
- [ ] SMS sender is DLT-registered
- [ ] VAPT completed with no unresolved high/critical findings
- [ ] Backups verified via an actual test restore
- [ ] Load test meets pilot-scale targets (1,000+ concurrent, 10k+ requests/day)
- [ ] Observability stack (Prometheus/Grafana/Loki) is live and alerting
- [ ] Worker mobile app is on the Play Store internal testing track for pilot Societies
- [ ] Multilingual UI verified on both web and mobile for all launch locales
