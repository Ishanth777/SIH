import React from 'react';

export type StatusIntent =
  | 'PENDING'
  | 'MATCHED'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'OPEN'
  | 'RESOLVED'
  | 'VERIFIED'
  | 'REJECTED'
  | 'ONLINE'
  | 'OFFLINE';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const normalized = status.toUpperCase();

  const getColors = () => {
    switch (normalized) {
      case 'COMPLETED':
      case 'RESOLVED':
      case 'VERIFIED':
      case 'ONLINE':
        return 'bg-[#D1FAE5] text-[#047857] border-[#059669]/20';
      case 'IN_PROGRESS':
      case 'ACCEPTED':
      case 'MATCHED':
      case 'ASSIGNED':
        return 'bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]/20';
      case 'OPEN':
      case 'REJECTED':
      case 'CANCELLED':
      case 'OFFLINE':
        return 'bg-[#FEE2E2] text-[#B91C1C] border-[#EF4444]/20';
      case 'PENDING':
      default:
        return 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-heading font-extrabold uppercase tracking-wider border ${getColors()} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {status.replace(/_/g, ' ')}
    </span>
  );
};
