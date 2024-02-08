import type { Metadata } from 'next';
import { clsx } from "clsx"
import { RootProviders } from '@state';
import { Comfortaa } from 'next/font/google';
import './globals.css';

const comfortaa = Comfortaa({ subsets: ['latin'] });

const classes = clsx({
  [comfortaa.className]: true,
})

export const metadata: Metadata = {
  title: process.env.PATTERNS_TITLE,
  description: process.env.PATTERNS_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={comfortaa.className}>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
