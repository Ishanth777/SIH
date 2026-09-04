-- ============================================================
-- Row-Level Security (RLS) Policies
-- ============================================================
-- Per rules A1, T1, T2:
-- - Every tenant-scoped table has RLS enabled
-- - Authenticated requests set app.current_cooperative_id
-- - Cross-tenant access returns 403, not empty results
-- ============================================================

-- Helper function to get current cooperative ID from session
CREATE OR REPLACE FUNCTION current_cooperative_id()
RETURNS UUID AS $$
BEGIN
  RETURN NULLIF(current_setting('app.current_cooperative_id', true), '')::UUID;
END;
$$ LANGUAGE plpgsql STABLE;

-- Helper function to get current federation ID from session
CREATE OR REPLACE FUNCTION current_federation_id()
RETURNS UUID AS $$
BEGIN
  RETURN NULLIF(current_setting('app.current_federation_id', true), '')::UUID;
END;
$$ LANGUAGE plpgsql STABLE;

-- ── Enable RLS on all tenant-scoped tables ─────────────────

ALTER TABLE cooperative_societies ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE welfare_enrollments ENABLE ROW LEVEL SECURITY;

-- ── Cooperative Societies ──────────────────────────────────
-- Federation admins see all cooperatives in their federation.
-- Society admins see only their own cooperative.

DROP POLICY IF EXISTS cooperative_isolation ON cooperative_societies;
CREATE POLICY cooperative_isolation ON cooperative_societies
  USING (
    -- Federation admin: sees all cooperatives in their federation
    current_federation_id() IS NOT NULL AND federation_id = current_federation_id()
    OR
    -- Society admin/worker/customer: sees only their cooperative
    id = current_cooperative_id()
  );

-- ── Workers ────────────────────────────────────────────────
-- Scoped by cooperative_id

DROP POLICY IF EXISTS worker_isolation ON workers;
CREATE POLICY worker_isolation ON workers
  USING (cooperative_id = current_cooperative_id());

-- ── Customers ──────────────────────────────────────────────
-- Scoped by cooperative_id

DROP POLICY IF EXISTS customer_isolation ON customers;
CREATE POLICY customer_isolation ON customers
  USING (cooperative_id = current_cooperative_id());

-- ── Service Requests ───────────────────────────────────────
-- Scoped by cooperative_id

DROP POLICY IF EXISTS service_request_isolation ON service_requests;
CREATE POLICY service_request_isolation ON service_requests
  USING (cooperative_id = current_cooperative_id());

-- ── Jobs ───────────────────────────────────────────────────
-- Scoped by cooperative_id

DROP POLICY IF EXISTS job_isolation ON jobs;
CREATE POLICY job_isolation ON jobs
  USING (cooperative_id = current_cooperative_id());

-- ── Payments ───────────────────────────────────────────────
-- Payments are accessed through their job, which is already scoped.
-- Additional policy ensures direct payment queries are also isolated.

DROP POLICY IF EXISTS payment_isolation ON payments;
CREATE POLICY payment_isolation ON payments
  USING (
    job_id IN (
      SELECT id FROM jobs WHERE cooperative_id = current_cooperative_id()
    )
  );

-- ── Ratings ────────────────────────────────────────────────
-- Ratings are accessed through their job.

DROP POLICY IF EXISTS rating_isolation ON ratings;
CREATE POLICY rating_isolation ON ratings
  USING (
    job_id IN (
      SELECT id FROM jobs WHERE cooperative_id = current_cooperative_id()
    )
  );

-- ── Disputes ───────────────────────────────────────────────
-- Disputes are accessed through their job.

DROP POLICY IF EXISTS dispute_isolation ON disputes;
CREATE POLICY dispute_isolation ON disputes
  USING (
    job_id IN (
      SELECT id FROM jobs WHERE cooperative_id = current_cooperative_id()
    )
  );

-- ── Welfare Enrollments ────────────────────────────────────
-- Accessed through worker, which is cooperative-scoped.

DROP POLICY IF EXISTS welfare_enrollment_isolation ON welfare_enrollments;
CREATE POLICY welfare_enrollment_isolation ON welfare_enrollments
  USING (
    worker_id IN (
      SELECT id FROM workers WHERE cooperative_id = current_cooperative_id()
    )
  );

-- ── Force RLS on table owners too (security best practice) ─

ALTER TABLE cooperative_societies FORCE ROW LEVEL SECURITY;
ALTER TABLE workers FORCE ROW LEVEL SECURITY;
ALTER TABLE customers FORCE ROW LEVEL SECURITY;
ALTER TABLE service_requests FORCE ROW LEVEL SECURITY;
ALTER TABLE jobs FORCE ROW LEVEL SECURITY;
ALTER TABLE payments FORCE ROW LEVEL SECURITY;
ALTER TABLE ratings FORCE ROW LEVEL SECURITY;
ALTER TABLE disputes FORCE ROW LEVEL SECURITY;
ALTER TABLE welfare_enrollments FORCE ROW LEVEL SECURITY;
