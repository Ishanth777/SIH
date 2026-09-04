'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, SupportedLanguage } from '../../context/LanguageContext';

export function LanguageSelector({ variant = 'default' }: { variant?: 'default' | 'compact' | 'header' }) {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition"
        aria-expanded={isOpen}
        title="Select Language (Powered by IndicTrans2 / Bhashini)"
      >
        <span className="text-sm leading-none">{currentLang.flag}</span>
        <span className="font-heading">{currentLang.nativeName}</span>
        <span className="text-[10px] text-slate-400 font-mono">({currentLang.code.toUpperCase()})</span>
        <svg
          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Language / भाषा
            </span>
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              Indic2
            </span>
          </div>

          <div className="max-h-60 overflow-y-auto py-1">
            {languages.map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLanguage(item.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-slate-50 text-[#0E2150] font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.flag}</span>
                    <span className="font-heading">{item.nativeName}</span>
                    <span className="text-slate-400 text-[11px]">({item.name})</span>
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="px-3 pt-1.5 pb-1 border-t border-slate-100 text-[9px] text-slate-400 text-center font-mono">
            Multilingual Stack • IndicTrans2 / Bhashini
          </div>
        </div>
      )}
    </div>
  );
}
