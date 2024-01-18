// actions.ts
'use server'
 
import { redirect } from 'next/navigation'
 
export async function navigate(data: FormData) {
  redirect(`/posts/${data.get('id')}`)
}