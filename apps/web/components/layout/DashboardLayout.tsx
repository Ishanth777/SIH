'use client';

import React, { useState } from 'react';
import { Role } from '../../types/platform';
import { AppSidebar } from './AppSidebar';
import { ShieldCheckIcon, BotIcon } from '../icons';
import { LanguageSelector } from '../common/LanguageSelector';
import { WorkerRecommendationChatbot } from '../matching/WorkerRecommendationChatbot';
import Link from 'next/link';

interface DashboardLayoutProps {
  role: Role;
  userName?: string;
  userSubtitle?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardLayout({
  role,
  userName,
  userSubtitle,
  title,
  subtitle,
  actions,
  children,
}: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showAiChatbot, setShowAiChatbot] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar with collapse toggle */}
      <AppSidebar
        role={role}
        userName={userName}
        userSubtitle={userSubtitle}
        collapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onOpenAiAssistant={() => setShowAiChatbot(true)}
      />

      {/* Main Content Area with Dynamic Padding */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="text-slate-400">BharatGig</span>
              <span>/</span>
              <span className="text-[#0E2150] font-semibold">{role.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sahayak AI Quick Launcher */}
            <button
              type="button"
              onClick={() => setShowAiChatbot(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#0E2150] to-[#1A3470] text-white text-xs font-bold shadow-xs hover:opacity-90 transition"
              title="Open Sahayak AI Matcher"
            >
              <BotIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sahayak AI</span>
            </button>

            {/* Language Selector */}
            <LanguageSelector />

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cooperative Verified Session</span>
            </div>

            <Link
              href="/login"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
            >
              Role Switcher
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
            <div>
              <h1 className="text-2xl font-bold font-heading text-[#0E2150] tracking-tight">{title}</h1>
              {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>

          {/* Child Components */}
          {children}
        </main>
      </div>

      {/* Sahayak AI Chatbot Modal */}
      {showAiChatbot && (
        <WorkerRecommendationChatbot
          isOpen={showAiChatbot}
          onClose={() => setShowAiChatbot(false)}
        />
      )}
    </div>
  );
}
