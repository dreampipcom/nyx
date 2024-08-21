import type { Metadata } from 'next';
import { DPTopNav } from '@blocks/server';
import { RootProviders } from '@state';
import './globals.css';

export const metadata: Metadata = {
  title: process.env.PATTERNS_TITLE,
  description: process.env.PATTERNS_DESCRIPTION,
};

export default function RootLayout({ children, params }: { children: React.ReactNode }) {
  const { lang: orig } = params;
  const locale = orig === 'default' ? 'en' : orig;

  return (
    <html lang="en">
      <body>
        <RootProviders locale={locale}>
          <DPTopNav />
          {children}
        </RootProviders>
      </body>
    </html>
  );
}
