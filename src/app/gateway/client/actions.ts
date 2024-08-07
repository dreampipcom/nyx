// actions.ts
'use server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function navigate(url: string) {
  redirect(url);
}

export async function setCookie({ name, value }: { name: string; value: string }) {
  // Set cookie
  const cookiesStore = cookies();
  cookiesStore.set(name, value, { secure: true });
}

export async function getCookie({ name }: { name: string }) {
  // Set cookie
  // const cookiesStore = cookies()
  // const currentCookies = cookiesStore.getAll();
  // console.log({ currentCookies })
  return cookies().get(name);
  // console.log({ nextCookies: currentCookies })
}
