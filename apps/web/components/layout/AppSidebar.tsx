'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Role } from '../../types/platform';
import {
  HomeIcon,
  CompassIcon,
  ClipboardListIcon,
  CreditCardIcon,
  UserCheckIcon,
  BriefcaseIcon,
  BuildingIcon,
  ShieldAlertIcon,
  HeartPulseIcon,
  ActivityIcon,
  SparklesIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  UserIcon,
  BotIcon,
} from '../icons';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: string;
}

interface AppSidebarProps {
  role: Role;
  userName?: string;
  userSubtitle?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenAiAssistant?: () => void;
}

export function AppSidebar({
  role,
  userName = 'Anup Sharma',
  userSubtitle,
  collapsed = false,
  onToggleCollapse,
  onOpenAiAssistant,
}: AppSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getRoleHome = (r: Role): string => {
    switch (r) {
      case 'CUSTOMER':
        return '/customer';
      case 'WORKER':
        return '/worker';
      case 'SOCIETY_ADMIN':
        return '/society/dashboard';
      case 'FEDERATION_ADMIN':
        return '/federation';
      case 'SUPER_ADMIN':
        return '/admin';
      default:
        return '/';
    }
  };

  const getNavItems = (): NavItem[] => {
    switch (role) {
      case 'CUSTOMER':
        return [
          { label: 'Overview', href: '/customer', icon: HomeIcon },
          { label: 'Explore & Book', href: '/booking', icon: CompassIcon },
          { label: 'My Bookings', href: '/customer/bookings', icon: ClipboardListIcon, badge: '1 Active' },
          { label: 'Invoices & Receipts', href: '/customer/payments', icon: CreditCardIcon },
          { label: 'Support & Help', href: '/customer/support', icon: HeartPulseIcon },
        ];
      case 'WORKER':
        return [
          { label: 'Artisan Hub', href: '/worker', icon: HomeIcon },
          { label: 'Available Jobs', href: '/worker/jobs', icon: BriefcaseIcon },
          { label: 'Earnings & Payouts', href: '/worker/earnings', icon: CreditCardIcon },
          { label: 'Welfare Schemes', href: '/worker/welfare', icon: HeartPulseIcon },
          { label: 'KYC & Profile', href: '/worker/profile', icon: UserCheckIcon },
        ];
      case 'SOCIETY_ADMIN':
        return [
          { label: 'Branch Dashboard', href: '/society/dashboard', icon: HomeIcon },
          { label: 'Artisans & Guild', href: '/society/workers', icon: UserCheckIcon },
          { label: 'Dispute Desk', href: '/society/disputes', icon: ShieldAlertIcon, badge: '1 Open' },
          { label: 'AI Demand Forecast', href: '/society/forecasting', icon: SparklesIcon },
          { label: 'Welfare & Fund', href: '/society/welfare', icon: HeartPulseIcon },
        ];
      case 'FEDERATION_ADMIN':
        return [
          { label: 'Apex Governance', href: '/federation', icon: BuildingIcon },
          { label: 'KYC Verification', href: '/federation/worker-verification', icon: UserCheckIcon, badge: '2 Pending' },
          { label: 'Member Societies', href: '/federation/societies', icon: BuildingIcon },
          { label: 'State Analytics', href: '/federation/compliance', icon: ActivityIcon },
        ];
      case 'SUPER_ADMIN':
        return [
          { label: 'Platform Matrix', href: '/admin', icon: ActivityIcon },
          { label: 'Federation Registry', href: '/admin/federations', icon: BuildingIcon },
          { label: 'System Logs & RLS', href: '/admin/system', icon: ShieldCheckIcon },
        ];
      default:
        return [{ label: 'Dashboard', href: '/customer', icon: HomeIcon }];
    }
  };

  const navItems = getNavItems();

  const getRoleBadge = () => {
    switch (role) {
      case 'CUSTOMER':
        return { label: 'Household Member', color: 'bg-slate-100 text-slate-700' };
      case 'WORKER':
        return { label: 'Guild Artisan', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' };
      case 'SOCIETY_ADMIN':
        return { label: 'Society Admin', color: 'bg-navy-50 text-navy-800 border border-navy-200' };
      case 'FEDERATION_ADMIN':
        return { label: 'Federation Apex', color: 'bg-amber-50 text-amber-800 border border-amber-200' };
      case 'SUPER_ADMIN':
        return { label: 'Super Admin', color: 'bg-purple-50 text-purple-800 border border-purple-200' };
    }
  };

  const roleInfo = getRoleBadge();
  const roleHomeHref = getRoleHome(role);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-3 left-4 z-50 flex items-center gap-2">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-700 hover:bg-slate-50"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ${
          collapsed ? 'w-64 lg:w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div
          className={`h-16 border-b border-slate-100 flex items-center ${
            collapsed ? 'justify-center px-2' : 'justify-between px-6'
          }`}
        >
          <Link
            href={roleHomeHref}
            title="Go to Dashboard Home"
            className="flex items-center gap-2.5 overflow-hidden"
          >
            <div className="w-9 h-9 min-w-[2.25rem] rounded-xl bg-[#0E2150] flex items-center justify-center text-white font-bold text-sm shadow-sm hover:opacity-90 transition">
              BG
            </div>
            {!collapsed && (
              <div className="transition-opacity duration-200">
                <span className="font-heading font-black text-lg tracking-tight text-[#0E2150]">BharatGig</span>
                <span className="block text-[9px] font-bold text-[#059669] tracking-wider uppercase -mt-0.5">
                  Cooperative Portal
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse / Expand Toggle Button */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className={`hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition ${
                collapsed ? 'ml-1' : ''
              }`}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRightIcon className="w-4 h-4" />
              ) : (
                <ChevronLeftIcon className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* User / Portal Role Pill */}
        <div className={`border-b border-slate-100 bg-slate-50/50 ${collapsed ? 'py-3 flex justify-center' : 'p-4'}`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div
              className="w-9 h-9 min-w-[2.25rem] rounded-full bg-[#0E2150] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm relative group cursor-pointer"
              title={`${userName} (${roleInfo.label})`}
            >
              {userName.substring(0, 2)}
              {collapsed && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              )}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate font-heading">{userName}</p>
                <p className="text-[11px] text-slate-500 truncate">{userSubtitle || roleInfo.label}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <div className="mt-2.5">
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${roleInfo.color}`}>
                {roleInfo.label}
              </span>
            </div>
          )}
        </div>

        {/* AI Assistant Quick Launcher Pill */}
        <div className={`p-2 border-b border-slate-100 ${collapsed ? 'flex justify-center' : 'px-3'}`}>
          <button
            type="button"
            onClick={onOpenAiAssistant}
            title="Open Sahayak AI Matcher"
            className={`flex items-center ${
              collapsed
                ? 'w-10 h-10 justify-center rounded-xl'
                : 'w-full justify-between px-3 py-2 rounded-lg'
            } bg-gradient-to-r from-[#0E2150] to-[#1A3470] text-white shadow-xs hover:opacity-95 transition relative group`}
          >
            <BotIcon className="w-4 h-4 text-emerald-400 shrink-0" />
            {!collapsed && (
              <span className="text-xs font-bold tracking-tight">Sahayak AI Matcher</span>
            )}
            {!collapsed && (
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                AI
              </span>
            )}
            {collapsed && (
              <span className="absolute left-full ml-3 px-2 py-1 bg-slate-900 text-white text-[11px] rounded-md whitespace-nowrap font-medium shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                Sahayak AI Matcher
              </span>
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <div className={`flex-1 ${collapsed ? 'px-2 py-3' : 'px-3 py-4'} space-y-1.5 overflow-y-auto`}>
          {!collapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Navigation</div>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`relative group flex items-center ${
                  collapsed
                    ? 'w-10 h-10 mx-auto justify-center rounded-xl'
                    : 'justify-between px-3 py-2.5 rounded-lg text-xs'
                } font-medium transition-all ${
                  isActive
                    ? 'bg-[#0E2150] text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                {!collapsed && <span className="ml-3 flex-1">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
                {collapsed && (
                  <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] rounded-md whitespace-nowrap font-medium shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className={`p-2 border-t border-slate-100 space-y-1 bg-slate-50/50 ${collapsed ? 'flex flex-col items-center' : 'p-3'}`}>
          <Link
            href="/login"
            className={`relative group flex items-center ${
              collapsed ? 'w-10 h-10 justify-center rounded-xl' : 'gap-3 px-3 py-2 rounded-lg text-xs'
            } font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900`}
          >
            <UserIcon className="w-4 h-4 text-slate-500 shrink-0" />
            {!collapsed && <span>Switch Role / Portal</span>}
            {collapsed && (
              <span className="absolute left-full ml-3 px-2 py-1 bg-slate-900 text-white text-[11px] rounded-md whitespace-nowrap font-medium shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                Switch Role / Portal
              </span>
            )}
          </Link>
          <Link
            href="/"
            className={`relative group flex items-center ${
              collapsed ? 'w-10 h-10 justify-center rounded-xl' : 'gap-3 px-3 py-2 rounded-lg text-xs'
            } font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50`}
          >
            <LogOutIcon className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Public Home</span>}
            {collapsed && (
              <span className="absolute left-full ml-3 px-2 py-1 bg-slate-900 text-white text-[11px] rounded-md whitespace-nowrap font-medium shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                Public Home
              </span>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
}
