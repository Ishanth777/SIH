/**
 * API Client & Auth Helpers
 * Connects apps/web to the NestJS API auth endpoints.
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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Send OTP to Indian phone number (+91XXXXXXXXXX)
 */
export async function sendOtp(phone: string): Promise<{ message: string; expiresInSeconds: number }> {
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
}

/**
 * Verify OTP and retrieve access & refresh JWT tokens
 */
export async function verifyOtp(phone: string, code: string): Promise<AuthTokens> {
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
