// rm-decorator.ts
'use server'
import { getUserMeta } from "@model"
import { getServerSession } from "next-auth/next";
import { authOptions } from "@auth"
import { finalAuth } from "@auth/adapter"

/* private */
const decorateCharacter = (character, uMeta) => {
	const decd = {...character}
	decd.favorite = undefined
	if(uMeta.rickmorty.favorites.characters.includes(character?.id)) decd.favorite = true
	decd.favorite = false
	return decd
}

/* public */
export const decorateRMCharacters = async (characters, uid) => {
	const uMeta = await getUserMeta({ id: uid })
	const decd = characters.map((char) => decorateCharacter(char, uMeta))
	return decd
}