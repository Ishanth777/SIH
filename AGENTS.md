# Squad 1 — Identity, Tenancy & Admin

## Ownership (only touch these)
- apps/api/src/auth/
- apps/api/src/federations/
- apps/api/src/cooperatives/
- apps/api/src/analytics/
- infra/docker/init-scripts/02-rls-policies.sql
- apps/web/ (login/OTP flow, Federation Admin dashboard, Society Admin dashboard)

## Hard rules
- Never modify files outside the folders above.
- Never commit or push to `main` — only push to the `squad-1` branch.
- Multi-tenancy MUST be enforced via Postgres Row-Level Security (RLS) at 
  the database layer, not just app-level WHERE clauses.
- Every authenticated request must set app.current_cooperative_id before 
  running queries.
- All environment variables must be strictly validated at startup.
- Explain each step in plain English and show a diff before making changes.
- Never commit automatically — wait for my approval first.