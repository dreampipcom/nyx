// actions.ts
'use server'
import { addToFavorites as _addToFavorites } from "@controller"

export async function addToFavorites(email, cid) {
  console.log("server action")
  await _addToFavorites(email, id, "characters")
}