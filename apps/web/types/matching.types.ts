export type ServiceCategory = 'ELECTRICIAN' | 'PLUMBER' | 'CLEANER' | 'CAREGIVER';

export type RequestType = 'SCHEDULED' | 'EMERGENCY';

export type JobStatus = 
  | 'PENDING' 
  | 'MATCHED' 
  | 'ACCEPTED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'DISPUTED';

export interface ServiceCatalogItem {
  id: string;
  category: ServiceCategory;
  name: string;
  description: string | null;
  baseRateMin: number;
  baseRateMax: number;
  unit: string;
}

export interface CreateServiceRequestPayload {
  cooperativeId: string;
  serviceCatalogId: string;
  type: RequestType;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  scheduledAt?: string;
  estimatedHours?: number;
}

export interface ServiceRequestResponse {
  id: string;
  customerId: string;
  cooperativeId: string;
  serviceCatalogId: string;
  type: RequestType;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  scheduledAt?: string;
  estimatedHours?: number;
  createdAt: string;
  serviceCatalog?: ServiceCatalogItem;
  job?: {
    id: string;
    status: JobStatus;
    workerId?: string;
  };
}
