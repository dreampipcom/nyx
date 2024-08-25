import type { Metadata } from 'next';
import { DPTopNav } from '@blocks/server';
import { RootProviders } from '@state';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
// import "@dreampipcom/oneiros/styles"
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  // fetch data
  const t = await getTranslations('Dashboard');

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: any }) {
  const { locale: orig } = params;
  const locale = orig === 'default' ? 'en' : orig;

  const messages = await getMessages();
  const libLocale = await getLocale();

  return (
    <html lang={locale || libLocale}>
      <body>
        <RootProviders locale={locale || libLocale}>
          <NextIntlClientProvider messages={messages}>
            <DPTopNav />
            {children}
          </NextIntlClientProvider>
        </RootProviders>
      </body>
    </html>
  );
}
