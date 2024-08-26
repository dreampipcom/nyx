import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { getSession } from '@auth';
import { DPTopNav } from '@blocks/server';
import { RootProviders } from '@state';
import { getUserServices, getUserAbilities } from '@gateway';
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

  const coercedLocale = libLocale || locale;

  const cookieStore = cookies().getAll();
  const cookiesStr = cookieStore.reduce((str, cookie) => {
    const next = `${str} ${cookie.name}=${cookie.value};`;
    return next;
  }, ``);

  const session = await getSession({ cookies: cookiesStr });

  const user = session?.user;
  const _services = (await getUserServices())?.data?.services || [];
  const _abilities = (await getUserAbilities())?.data?.abilities || [];

  // to-do: IMPROVE THIS
  // https://www.notion.so/angeloreale/Nyx-Improve-locale-parsing-for-services-d02ab83262be4c19987119c30a530480?pvs=4
  const parseData = (dataset: any) =>
    dataset
      .filter((entry) => {
        return !!entry.slug && !entry.slug.includes('mock');
      })
      .map((entry) => {
        const localeSplit = coercedLocale?.split('-');
        if (localeSplit?.length > 0) {
          return {
            ...entry,
            name: entry.name[localeSplit[0]] || entry.name[localeSplit[1]],
          };
        } else {
          return {
            ...entry,
            name: entry.name['en'],
          };
        }
      });

  const services = parseData(_services);
  const abilities = parseData(_abilities);

  return (
    <html lang={libLocale || locale}>
      <body>
        <RootProviders locale={locale || libLocale} user={user} services={services} abilities={abilities}>
          <NextIntlClientProvider messages={messages}>
            <DPTopNav user={user} services={services} />
            {children}
          </NextIntlClientProvider>
        </RootProviders>
      </body>
    </html>
  );
}
