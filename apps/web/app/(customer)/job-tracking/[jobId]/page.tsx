'use client';

import React, { useEffect, useState } from 'react';
import { useSocket } from '../../../../hooks/useSocket';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Radio,
  ShieldCheck,
  AlertCircle,
  RotateCw,
  ChevronRight,
} from 'lucide-react';

const LIFECYCLE_STEPS = [
  { key: 'PENDING', label: 'Requested' },
  { key: 'ACCEPTED', label: 'Accepted' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'COMPLETED', label: 'Completed' },
];

export default function JobTrackingPage({ params }: { params: { jobId: string } }) {
  const { socket, isConnected } = useSocket('mock-customer-token');
  const [jobStatus, setJobStatus] = useState<string>('PENDING');

  useEffect(() => {
    if (!socket) return;
    
    socket.emit('job:join_room', { jobId: params.jobId });

    socket.on('job:status', (data: { jobId: string; status: string }) => {
      if (data.jobId === params.jobId) {
        setJobStatus(data.status);
      }
    });

    return () => {
      socket.emit('job:leave_room', { jobId: params.jobId });
      socket.off('job:status');
    };
  }, [socket, params.jobId]);

  const currentStepIndex = LIFECYCLE_STEPS.findIndex((s) => s.key === jobStatus);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <div className="glass-panel animate-fade-in" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '36px 32px',
      }}>
        {/* Top Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div className="badge badge-emerald">
            <Briefcase size={13} />
            <span>Job #{params.jobId}</span>
          </div>

          <div className="badge badge-indigo">
            <Radio size={13} className={isConnected ? 'animate-pulse' : ''} />
            <span>{isConnected ? 'Real-Time Sync Active' : 'Connecting...'}</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Live Job Tracker
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Real-time status updates broadcasted via Redis-backed WebSocket gateway.
          </p>
        </div>

        {/* Lifecycle Stepper */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          padding: '16px 14px',
          background: '#f8fafc',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
        }}>
          {LIFECYCLE_STEPS.map((step, idx) => {
            const isCompleted = currentStepIndex > idx || jobStatus === 'COMPLETED';
            const isCurrent = currentStepIndex === idx;

            return (
              <React.Fragment key={step.key}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                    background: isCompleted || isCurrent
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : '#ffffff',
                    color: isCompleted || isCurrent ? '#ffffff' : 'var(--text-muted)',
                    border: isCompleted || isCurrent ? 'none' : '1px solid var(--border-subtle)',
                    boxShadow: isCurrent ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none',
                  }}>
                    {isCompleted ? <CheckCircle2 size={15} /> : idx + 1}
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: isCurrent ? 700 : 500,
                    color: isCurrent ? 'var(--accent-primary-hover)' : 'var(--text-secondary)',
                  }}>
                    {step.label}
                  </span>
                </div>
                {idx < LIFECYCLE_STEPS.length - 1 && (
                  <div style={{
                    flex: 1,
                    height: '2px',
                    background: currentStepIndex > idx ? '#10b981' : '#e2e8f0',
                    margin: '0 4px',
                    marginBottom: '18px',
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Current Status Box */}
        <div style={{
          padding: '24px',
          background: '#f8fafc',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          textAlign: 'center',
          marginBottom: '24px',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 700,
            color: 'var(--text-muted)',
            marginBottom: '8px',
          }}>
            <Clock size={14} />
            <span>Current Status</span>
          </div>

          <div style={{
            fontSize: '28px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: jobStatus === 'COMPLETED' ? 'var(--accent-primary)' : '#4f46e5',
            marginTop: '4px',
          }}>
            {jobStatus.replace('_', ' ')}
          </div>
        </div>

        {/* Completion Banner */}
        {jobStatus === 'COMPLETED' ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 16px',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: 'var(--radius-sm)',
            color: '#047857',
            fontSize: '13px',
            marginBottom: '20px',
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>Your service job has been successfully completed!</span>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 14px',
            background: '#eef2ff',
            border: '1px solid #c7d2fe',
            borderRadius: 'var(--radius-sm)',
            color: '#4338ca',
            fontSize: '12px',
            marginBottom: '20px',
          }}>
            <ShieldCheck size={16} style={{ flexShrink: 0 }} />
            <span>Protected by cooperative service escrow and fair-wage compliance.</span>
          </div>
        )}

        {/* Connection footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}>
          <span>Gateway: EventsGateway</span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: isConnected ? '#059669' : '#e11d48',
            fontWeight: 600,
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isConnected ? '#10b981' : '#f43f5e',
            }} />
            {isConnected ? 'Online' : 'Disconnected'}
          </span>
        </div>
      </div>
    </div>
  );
}
