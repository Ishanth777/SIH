-- Enable PostGIS extension (required by rule A2)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;
