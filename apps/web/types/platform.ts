export type Role = 'CUSTOMER' | 'WORKER' | 'SOCIETY_ADMIN' | 'FEDERATION_ADMIN' | 'SUPER_ADMIN';

export type JobStatus = 'PENDING' | 'MATCHED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type VerificationStatus = 'VERIFIED' | 'UNDER_REVIEW' | 'PENDING' | 'REJECTED';

export type DisputeStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'ESCALATED';

export interface ServiceCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  baseRateMin: number;
  baseRateMax: number;
  unit: string;
  typicalDuration: string;
  activeWorkers: number;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  category: string;
  cooperativeId: string;
  cooperativeName: string;
  federationId: string;
  verificationStatus: VerificationStatus;
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  monthlyEarnings: number;
  welfareEnrolled: boolean;
  kycDocUrl?: string;
  joinedDate: string;
}

export interface CooperativeSociety {
  id: string;
  name: string;
  registrationNumber: string;
  district: string;
  state: string;
  federationId: string;
  federationName: string;
  totalWorkers: number;
  activeWorkers: number;
  activeBookings: number;
  monthlyRevenue: number;
  openDisputes: number;
  verifiedRate: number;
}

export interface Federation {
  id: string;
  name: string;
  state: string;
  totalSocieties: number;
  totalWorkers: number;
  totalJobs: number;
  totalDisbursement: number;
  complianceScore: number;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  workerId?: string;
  workerName?: string;
  serviceId: string;
  serviceName: string;
  category: string;
  cooperativeId: string;
  cooperativeName: string;
  status: JobStatus;
  urgency: 'SCHEDULED' | 'EMERGENCY';
  address: string;
  scheduledDate: string;
  scheduledTime: string;
  amount: number;
  isPaid: boolean;
  paymentMethod: 'UPI' | 'CASH' | 'CARD';
  rating?: number;
  feedback?: string;
  createdAt: string;
}

export interface DisputeRecord {
  id: string;
  jobId: string;
  customerName: string;
  workerName: string;
  serviceName: string;
  cooperativeName: string;
  reason: string;
  amountInDispute: number;
  status: DisputeStatus;
  filedDate: string;
  resolutionNotes?: string;
}

export interface WelfareScheme {
  id: string;
  name: string;
  category: string;
  coverage: string;
  premium: string;
  govtContribution: string;
  eligibility: string;
  enrolledWorkers: number;
}
