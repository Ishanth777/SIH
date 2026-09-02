import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Cooperative Labour Marketplace',
  description: 'Fair-wage on-demand & scheduled service booking platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤝</span>
              <span className="font-bold text-lg tracking-tight text-slate-900">
                Co-op Marketplace
              </span>
            </div>
            <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
              <a href="/booking" className="hover:text-blue-600 transition">
                Book Service
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
