import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cooperative Gig Platform — Identity & Admin',
  description: 'Multi-tenant labour platform powered by PostgreSQL Row-Level Security',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
