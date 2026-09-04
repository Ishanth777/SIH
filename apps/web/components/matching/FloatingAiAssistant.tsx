'use client';

import React, { useState } from 'react';
import { BotIcon, SparklesIcon } from '../icons';
import { WorkerRecommendationChatbot } from './WorkerRecommendationChatbot';

export function FloatingAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <aside aria-label="Sahayak AI Floating Assistant" className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#0E2150] via-[#1A3470] to-[#0E2150] text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all border border-emerald-400/40"
          title="Open Sahayak AI Matcher"
        >
          <div className="relative">
            <BotIcon className="w-5 h-5 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="font-heading font-black text-xs tracking-tight">
            Sahayak AI Matcher
          </span>
          <span className="hidden sm:inline text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider">
            Deterministic
          </span>
        </button>
      </aside>

      {/* Chatbot Modal */}
      {isOpen && (
        <WorkerRecommendationChatbot
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSelectWorker={(worker) => {
            // Optional callback when a worker is selected
          }}
        />
      )}
    </>
  );
}
