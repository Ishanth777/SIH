/**
 * API Client & Auth Helpers
 * Connects apps/web to the NestJS API auth, analytics, and cooperatives endpoints.
 */

export interface UserSession {
  sub: string;
  phone: string;
  role: 'FEDERATION_ADMIN' | 'SOCIETY_ADMIN' | 'WORKER' | 'CUSTOMER';
  cooperativeId?: string;
  federationId?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface FederationMetrics {
  totalWorkers: number;
  totalJobs: number;
  completedJobs: number;
  completionRate: number;
  totalRevenue: number;
  activeDisputes: number;
}

export interface SocietyMetrics {
  totalWorkers: number;
  totalJobs: number;
  completedJobs: number;
  completionRate: number;
  totalRevenue: number;
}

export interface CooperativeSociety {
  id: string;
  name: string;
  registrationNumber?: string;
  address?: string;
  federationId: string;
  createdAt: string;
  latitude?: number;
  longitude?: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Send OTP to Indian phone number (+91XXXXXXXXXX)
 */
export async function sendOtp(phone: string): Promise<{ message: string; expiresInSeconds: number; demoCode?: string }> {
  try {
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to send OTP');
    }
    return data;
  } catch (err: any) {
    // When NestJS backend is offline, enable seamless demo OTP for testing
    if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
      return {
        message: '⚡ Demo Mode (API offline): Enter demo code 123456 to sign in',
        expiresInSeconds: 300,
        demoCode: '123456',
      };
    }
    throw err;
  }
}

/**
 * Verify OTP and retrieve access & refresh JWT tokens
 */
export async function verifyOtp(phone: string, code: string): Promise<AuthTokens> {
  try {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code }),
    });

    const data = await res.json();
    if (!res.ok) {
      const error = new Error(data.message || 'Failed to verify OTP');
      (error as any).errorCode = data.errorCode;
      throw error;
    }
    return data;
  } catch (err: any) {
    // When NestJS backend is offline, issue mock JWT so UI flow can be evaluated
    if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
      const role = phone.includes('9000000002') ? 'SOCIETY_ADMIN' : 'FEDERATION_ADMIN';
      const payload = {
        sub: 'demo-user-id',
        phone,
        role,
        cooperativeId: 'coop-demo-1',
        federationId: 'fed-demo-1',
      };
      const mockJwt = `eyJhbGciOiJIUzI1NiJ9.${btoa(JSON.stringify(payload))}.demo-signature`;
      return {
        accessToken: mockJwt,
        refreshToken: mockJwt,
        expiresIn: '15m',
      };
    }
    throw err;
  }
}

/**
 * Parse JWT payload without external library
 */
export function decodeJwt(token: string): UserSession | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Persist tokens in localStorage
 */
export function storeAuth(tokens: AuthTokens) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', tokens.accessToken);
    localStorage.setItem('refresh_token', tokens.refreshToken);
  }
}

/**
 * Retrieve active session from stored token
 */
export function getStoredSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  return decodeJwt(token);
}

/**
 * Clear authentication session
 */
export function clearAuth() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}

/**
 * Fetch Aggregated Metrics for a Federation
 */
export async function fetchFederationMetrics(federationId: string): Promise<FederationMetrics> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const res = await fetch(`${API_BASE}/analytics/federation/${federationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch federation metrics');
  }
  return res.json();
}

/**
 * Fetch Aggregated Metrics for a Cooperative Society
 */
export async function fetchSocietyMetrics(cooperativeId: string): Promise<SocietyMetrics> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const res = await fetch(`${API_BASE}/analytics/society/${cooperativeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch society metrics');
  }
  return res.json();
}

/**
 * List Cooperatives by Federation
 */
export async function fetchCooperatives(federationId: string): Promise<{ data: CooperativeSociety[]; total: number }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const res = await fetch(`${API_BASE}/cooperatives?federationId=${federationId}&limit=50`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch cooperatives');
  }
  return res.json();
}

/**
 * Register a new Cooperative Society
 */
export async function createCooperative(dto: {
  federationId: string;
  name: string;
  registrationNumber?: string;
  address?: string;
}): Promise<CooperativeSociety> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const res = await fetch(`${API_BASE}/cooperatives`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to create cooperative');
  }
  return data;
}
