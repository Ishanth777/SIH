import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtitle,
  subtext,
  icon,
  trend,
  trendPositive = true,
}) => {
  const displaySubtitle = subtitle || subtext;
  return (
    <div className="card-base card-hover p-5 sm:p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between text-[#94A3B8] mb-2">
        <span className="label-style">{label}</span>
        {icon && <div className="text-[#0E2150]">{icon}</div>}
      </div>

      <div className="my-1">
        <div className="font-heading font-black text-2xl sm:text-3xl text-[#0D1829] tracking-tight">
          {value}
        </div>
      </div>

      {(displaySubtitle || trend) && (
        <div className="flex items-center justify-between text-xs mt-1 font-sans">
          {displaySubtitle && <span className="text-[#475569]">{displaySubtitle}</span>}
          {trend && (
            <span
              className={`font-heading font-bold text-[11px] ${
                trendPositive ? 'text-[#059669]' : 'text-[#EF4444]'
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
