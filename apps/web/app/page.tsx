'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredSession } from '@/lib/api';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const session = getStoredSession();
    if (!session) {
      router.replace('/login');
    } else if (session.role === 'FEDERATION_ADMIN') {
      router.replace('/federation');
    } else if (session.role === 'SOCIETY_ADMIN') {
      router.replace('/society');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="badge badge-emerald" style={{ padding: '8px 16px', marginBottom: '16px' }}>
          Loading Cooperative Platform...
        </div>
      </div>
    </div>
  );
}
