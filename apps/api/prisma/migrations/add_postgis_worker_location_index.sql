-- ============================================================
-- PostGIS Spatial Index for Core Matching Engine (Rule A2)
-- ============================================================

-- Ensure PostGIS extension is active
CREATE EXTENSION IF NOT EXISTS postgis;

-- Functional GIST spatial index for ST_DWithin geography query pushdown
CREATE INDEX IF NOT EXISTS idx_workers_location_gist 
ON workers 
USING GIST (
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
)
WHERE "isAvailable" = true AND "verificationStatus" = 'VERIFIED';

-- Tenancy & skill filtering composite index
CREATE INDEX IF NOT EXISTS idx_workers_coop_available 
ON workers ("cooperativeId", "isAvailable", "verificationStatus");
