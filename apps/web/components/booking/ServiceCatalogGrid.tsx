'use client';

import React from 'react';
import { ServiceCatalogItem } from '../../types/matching.types';

interface ServiceCatalogGridProps {
  catalog: ServiceCatalogItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  loading?: boolean;
}

const CATEGORY_ICONS: Record<string, string> = {
  ELECTRICIAN: '⚡',
  PLUMBER: '🔧',
  CLEANER: '🧹',
  CAREGIVER: '🩺',
};

export const ServiceCatalogGrid: React.FC<ServiceCatalogGridProps> = ({
  catalog,
  selectedId,
  onSelect,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-[#F1F5F9] rounded-[16px] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {catalog.map((item) => {
        const isSelected = selectedId === item.id;
        const icon = CATEGORY_ICONS[item.category] || '🛠️';

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`p-4 text-left rounded-[16px] border transition-all duration-180 relative ${
              isSelected
                ? 'border-[#0E2150] bg-white ring-2 ring-[#0E2150]/20 shadow-md transform -translate-y-0.5'
                : 'border-[#E2E8F0] hover:border-[#CBD5E1] bg-white hover:-translate-y-0.5 hover:shadow-card-hover'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="w-10 h-10 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-xl shadow-xs">
                {icon}
              </span>
              {isSelected ? (
                <span className="badge-pill bg-[#D1FAE5] text-[#047857]">
                  Selected
                </span>
              ) : (
                <span className="badge-pill bg-[#F1F5F9] text-[#475569]">
                  Verified
                </span>
              )}
            </div>

            <div className="font-heading font-bold text-sm text-[#0D1829] leading-tight">
              {item.name}
            </div>
            <div className="font-sans text-xs text-[#475569] mt-1.5 flex items-center justify-between">
              <span className="font-bold text-[#059669]">
                ₹{item.baseRateMin} - ₹{item.baseRateMax}
              </span>
              <span className="text-[#94A3B8] text-[10px] uppercase font-bold">
                /{item.unit.replace('per_', '')}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
