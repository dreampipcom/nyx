// actions.ts
'use server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function navigate(url: string) {
  redirect(url);
}

export async function setCookie({ name, value }) {
  // Set cookie
  cookies().set(name, value);
}
