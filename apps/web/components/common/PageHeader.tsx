import React from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  description,
  actions,
}) => {
  return (
    <div className="pb-6 border-b border-[#E2E8F0] mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        {eyebrow && <span className="eyebrow block mb-1">{eyebrow}</span>}
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#0D1829] tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="font-sans text-xs sm:text-sm text-[#475569] mt-1 max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
};
