# Squad 2: Core Matching & Geo-Spatial (The Engine)

## Welcome to the Team
You own the algorithmic heart of the platform. You ensure that when a customer books a service, they are immediately matched with the nearest available, correctly-skilled, and verified worker using precise PostGIS geospatial queries.

## Your Domain Ownership
### Backend (NestJS / PostGIS / BullMQ)
- `apps/api/src/services-catalog/`
- `apps/api/src/requests/`
- `apps/api/src/matching/`

### Frontend (Next.js & Expo)
- **Next.js:** Customer service-request form (address entry, map pin-drop for lat/lng).
- **Expo:** Background location tracking for workers so their lat/lng is constantly updated in the database.

## Key Rules & Context
- **Rule A2:** PostGIS is used for all geo-spatial queries. No lat/lng math in application code.
- **Rule A3:** The deterministic rules-based matcher (`ST_DWithin`) must ALWAYS work independently of any AI layer. 
- **Rule B3:** Matching is fan-out via BullMQ (`MATCHING_QUEUE`). The matching algorithm is computationally heavy and must not block the API thread.

## Next Immediate Tasks
1. Build the Next.js Customer Booking Flow UI (selecting a service from the catalog and dropping a pin).
2. Wire up Expo location services (`expo-location`) to periodically ping the API and update the worker's `latitude`/`longitude`.
3. Fine-tune the `ST_DWithin` radius in `matching.service.ts` for different service densities.
