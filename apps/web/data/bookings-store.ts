'use client';

import { BOOKINGS_DATA, Booking, JobStatus } from './mock-data';

const STORAGE_KEY = 'coop_user_bookings';

export function getBookings(): Booking[] {
  if (typeof window === 'undefined') {
    return BOOKINGS_DATA;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(BOOKINGS_DATA));
      return BOOKINGS_DATA;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return BOOKINGS_DATA;
  } catch (err) {
    console.warn('Failed to load bookings from localStorage:', err);
    return BOOKINGS_DATA;
  }
}

export function addBooking(data: Partial<Booking>): Booking {
  const current = getBookings();
  const newId = `BKG-${Math.floor(100000 + Math.random() * 900000)}`;

  const newBooking: Booking = {
    id: newId,
    customerId: data.customerId || 'cust-user-1',
    customerName: data.customerName || 'Anup Sharma',
    customerPhone: data.customerPhone || '+91 98451 98210',
    workerId: data.workerId || 'w-001',
    workerName: data.workerName || 'Ramesh Kumar (Guild Master)',
    serviceId: data.serviceId || 'srv-001',
    serviceName: data.serviceName || 'Verified Guild Service',
    category: data.category || 'PLUMBER',
    cooperativeId: data.cooperativeId || 'soc-blr-01',
    cooperativeName: data.cooperativeName || 'Bangalore South Labour Guild #04',
    scheduledDate: data.scheduledDate || new Date().toLocaleDateString('en-GB'),
    scheduledTime: data.scheduledTime || (data.urgency === 'EMERGENCY' ? 'Immediate (15m)' : '10:00 AM'),
    address: data.address || 'Jayanagar 4th Block, Bengaluru, Karnataka',
    amount: data.amount || 500,
    status: data.status || 'IN_PROGRESS',
    urgency: data.urgency || 'EMERGENCY',
    isPaid: data.isPaid || false,
    paymentMethod: data.paymentMethod || 'UPI',
    createdAt: data.createdAt || new Date().toISOString(),
    rating: undefined,
  };

  const updated = [newBooking, ...current];

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('coop_booking_updated', { detail: newBooking }));
    } catch (err) {
      console.warn('Failed to persist booking to localStorage:', err);
    }
  }

  return newBooking;
}

export function updateBookingStatus(id: string, status: JobStatus): Booking | null {
  const current = getBookings();
  let updatedBooking: Booking | null = null;

  const next = current.map((b) => {
    if (b.id === id || b.id.toLowerCase() === id.toLowerCase()) {
      updatedBooking = { ...b, status };
      return updatedBooking;
    }
    return b;
  });

  if (typeof window !== 'undefined' && updatedBooking) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent('coop_booking_updated', { detail: updatedBooking }));
    } catch (err) {
      console.warn('Failed to update booking status in localStorage:', err);
    }
  }

  return updatedBooking;
}

export function getBookingById(id: string): Booking | undefined {
  const current = getBookings();
  return current.find(
    (b) => b.id === id || b.id.toLowerCase() === id.toLowerCase()
  );
}
