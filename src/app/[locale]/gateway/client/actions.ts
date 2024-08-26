// actions.ts
'use server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function navigate(url: string) {
  redirect(url);
}

export async function setCookie({ name, value, secure }: { name: string; value: string; secure: boolean }) {
  const cookiesStore = cookies();
  cookiesStore.set(name, value, { secure });
}

export async function getCookie({ name }: { name: string }) {
  return cookies().get(name)?.value;
}
