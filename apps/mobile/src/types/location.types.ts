export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  timestamp?: number;
}

export interface WorkerLocationPayload {
  latitude: number;
  longitude: number;
}

export interface JobOfferEvent {
  jobId: string;
  serviceRequestId: string;
  category: string;
  distanceMeters: number;
  radiusTierKm?: number;
}
