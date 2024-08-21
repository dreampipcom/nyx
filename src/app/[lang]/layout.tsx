import type { Metadata } from 'next';
import { DPTopNav } from '@blocks/server';
import { RootProviders } from '@state';
import './globals.css';

export const metadata: Metadata = {
  title: process.env.PATTERNS_TITLE,
  description: process.env.PATTERNS_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RootProviders>
          <DPTopNav />
          {children}
        </RootProviders>
      </body>
    </html>
  );
}
