import type { Metadata } from 'next';
import { DPTopNav } from '@blocks/server';
import { RootProviders } from '@state';
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import {getUserLocale} from '@gateway';
import './globals.css';


export const metadata: Metadata = {
  title: process.env.PATTERNS_TITLE,
  description: process.env.PATTERNS_DESCRIPTION,
};

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: any }) {
  const { locale: orig } = params;
  const locale = orig === 'default' ? 'en' : orig;

  const messages = await getMessages();
  const libLocale = await getLocale();
  console.log({ locale, libLocale })

  return (
    <html lang="en">
      <body>
        <RootProviders locale={locale}>
          <NextIntlClientProvider messages={messages}>
          <DPTopNav />
          {children}
          </NextIntlClientProvider>
        </RootProviders>
      </body>
    </html>
  );
}
