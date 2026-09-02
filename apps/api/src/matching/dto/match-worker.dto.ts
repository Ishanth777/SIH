export interface MatchWorkerPayload {
  serviceRequestId: string;
  cooperativeId: string;
}

export class MatchWorkerDto {
  serviceRequestId!: string;
  cooperativeId!: string;
}
