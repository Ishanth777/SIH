import React from 'react';
import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Cooperative Gig Services Platform | Smart India Hackathon 2026',
  description: 'Worker-first digital marketplace with guaranteed fair wage floors, transparent cooperative settlement, and automated tax invoices.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#060b19] min-h-screen text-slate-100 font-sans flex flex-col">
        {/* Navigation Bar matching screenshots */}
        <header className="sticky top-0 z-50 bg-[#060b19]/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-slate-950 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-5.45 9-12V7l-9-5zm-2 16l-4-4 1.41-1.41L10 15.17l6.59-6.59L18 10l-8 8z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              BharatGig
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
            >
              Portal Home
            </Link>
            <Link
              href="/payment/demo-job-101"
              className="bg-emerald-950/80 text-emerald-400 border border-emerald-700/80 hover:bg-emerald-900 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm"
            >
              Customer Checkout
            </Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
