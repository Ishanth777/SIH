'use client';

import React from 'react';
import { ServiceCatalogItem } from '../../types/matching.types';

interface ServiceCatalogGridProps {
  catalog: ServiceCatalogItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  loading?: boolean;
}

export const ServiceCatalogGrid: React.FC<ServiceCatalogGridProps> = ({
  catalog,
  selectedId,
  onSelect,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {catalog.map((item) => {
        const isSelected = selectedId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`p-3.5 text-left border rounded-xl transition-all ${
              isSelected
                ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="font-semibold text-slate-900">{item.name}</div>
            <div className="text-xs text-slate-500 mt-1">
              ₹{item.baseRateMin} - ₹{item.baseRateMax} /{item.unit.replace('per_', '')}
            </div>
          </button>
        );
      })}
    </div>
  );
};
