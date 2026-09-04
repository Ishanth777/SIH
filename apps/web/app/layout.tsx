import './globals.css';
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LanguageProvider } from '@/context/LanguageContext';
import { FloatingAiAssistant } from '@/components/matching/FloatingAiAssistant';

export const metadata = {
  title: 'BharatGig | Cooperative Labour Marketplace',
  description: 'Fair wages for artisans, trusted services for households, owned by cooperative guilds.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8FAFC] text-[#0D1829] flex flex-col font-sans selection:bg-[#D1FAE5] selection:text-[#047857]">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingAiAssistant />
        </LanguageProvider>
      </body>
    </html>
  );
}
