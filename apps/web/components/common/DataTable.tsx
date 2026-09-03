'use client';

import React, { useState } from 'react';
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon } from '../icons';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  title?: string;
  subtitle?: string;
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchFilterKey?: keyof T;
  filterTabs?: { label: string; value: string; count?: number }[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  actions?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
}

export function DataTable<T extends Record<string, any>>({
  title,
  subtitle,
  columns,
  data,
  searchPlaceholder = 'Search records...',
  searchFilterKey,
  filterTabs,
  activeTab,
  onTabChange,
  actions,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items matching your criteria.',
  pageSize = 10,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter Data by Search
  const filteredData = data.filter((row) => {
    if (!searchQuery) return true;
    if (searchFilterKey) {
      const val = row[searchFilterKey];
      return String(val || '').toLowerCase().includes(searchQuery.toLowerCase());
    }
    return Object.values(row).some((val) =>
      String(val || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      {(title || filterTabs || searchFilterKey || actions) && (
        <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {title && (
              <div>
                <h3 className="font-heading font-bold text-base text-[#0E2150]">{title}</h3>
                {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
              </div>
            )}
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0E2150] focus:bg-white text-slate-800 placeholder:text-slate-400"
                />
              </div>
              {actions}
            </div>
          </div>

          {/* Filter Tabs */}
          {filterTabs && filterTabs.length > 0 && (
            <div className="flex items-center gap-1.5 border-t border-slate-100 pt-3 overflow-x-auto">
              {filterTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => {
                    onTabChange?.(tab.value);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    activeTab === tab.value
                      ? 'bg-[#0E2150] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        activeTab === tab.value ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Table Content */}
      {paginatedData.length === 0 ? (
        <div className="p-8">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-heading">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className={`py-3 px-4 sm:px-6 ${col.className || ''}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-slate-50/70 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`py-3.5 px-4 sm:px-6 ${col.className || ''}`}>
                      {typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : col.accessor
                        ? row[col.accessor]
                        : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {filteredData.length > pageSize && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
