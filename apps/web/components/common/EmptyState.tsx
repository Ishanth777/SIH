import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}) => {
  return (
    <div className="card-base text-center py-12 px-6 flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0E2150] flex items-center justify-center mb-4 text-2xl shadow-xs">
        {icon || '📋'}
      </div>

      <h3 className="font-heading font-black text-lg text-[#0D1829] mb-1.5 tracking-tight">
        {title}
      </h3>

      <p className="font-sans text-xs sm:text-sm text-[#475569] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && (
        actionHref ? (
          <a
            href={actionHref}
            className="btn-action px-5 py-2.5 text-xs uppercase tracking-wider font-heading font-bold"
          >
            {actionText}
          </a>
        ) : (
          <button
            onClick={onAction}
            className="btn-action px-5 py-2.5 text-xs uppercase tracking-wider font-heading font-bold"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  );
};
