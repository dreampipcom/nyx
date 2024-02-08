import type { Metadata } from 'next';
import { clsx } from 'clsx';
import { RootProviders } from '@state';
import { Comfortaa } from 'next/font/google';
import './globals.css';
import styles from '@styles/page.module.css';

const comfortaa = Comfortaa({ subsets: ['latin'], variable: '--nexus-font' });

const classes = clsx({
  [comfortaa.className]: true,
  [comfortaa.variable]: true,
  [styles.text]: true,
});

export const metadata: Metadata = {
  title: process.env.PATTERNS_TITLE,
  description: process.env.PATTERNS_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body className={classes}>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
