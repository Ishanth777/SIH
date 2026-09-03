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
  UserIcon,
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
}

export function AppSidebar({ role, userName = 'Anup Sharma', userSubtitle }: AppSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

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
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0E2150] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              BG
            </div>
            <div>
              <span className="font-heading font-black text-lg tracking-tight text-[#0E2150]">BharatGig</span>
              <span className="block text-[9px] font-bold text-[#059669] tracking-wider uppercase -mt-0.5">
                Cooperative Portal
              </span>
            </div>
          </Link>
        </div>

        {/* User / Portal Role Pill */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0E2150] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
              {userName.substring(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate font-heading">{userName}</p>
              <p className="text-[11px] text-slate-500 truncate">{userSubtitle || roleInfo.label}</p>
            </div>
          </div>
          <div className="mt-2.5">
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${roleInfo.color}`}>
              {roleInfo.label}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Navigation</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#0E2150] text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-100 space-y-1 bg-slate-50/50">
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <UserIcon className="w-4 h-4 text-slate-500" />
            <span>Switch Role / Portal</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50"
          >
            <LogOutIcon className="w-4 h-4" />
            <span>Public Home</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
