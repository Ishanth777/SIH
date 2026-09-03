'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '../../../../hooks/useSocket';

export default function JobTrackingPage({ params }: { params: { jobId: string } }) {
  const { socket, isConnected } = useSocket('mock-customer-token');
  const [jobStatus, setJobStatus] = useState<string>('PENDING');

  useEffect(() => {
    if (!socket) return;
    
    socket.emit('job:join_room', { jobId: params.jobId });

    socket.on('job:status', (data) => {
      if (data.jobId === params.jobId) {
        setJobStatus(data.status);
      }
    });

    return () => {
      socket.emit('job:leave_room', { jobId: params.jobId });
      socket.off('job:status');
    };
  }, [socket, params.jobId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Job #{params.jobId}</h1>
        
        <div className="mb-6">
          <span className="text-gray-500">Connection Status: </span>
          <span className={isConnected ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}>
            {isConnected ? 'Live' : 'Reconnecting...'}
          </span>
        </div>

        <div className="bg-gray-100 p-6 rounded-md">
          <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Current Status</h2>
          <p className="text-3xl font-extrabold text-blue-600">
            {jobStatus.replace('_', ' ')}
          </p>
        </div>

        {jobStatus === 'COMPLETED' && (
          <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-md">
            Your job has been successfully completed!
          </div>
        )}
      </div>
    </div>
  );
}
