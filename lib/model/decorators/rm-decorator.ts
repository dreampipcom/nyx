// rm-decorator.ts
import { getUserMeta } from "@model"

export const decorateRMCharacter = async ({ charId, userId }) => {
	const uMeta = await getUserMeta({ id: userId })
	//uMeta.rickmorty.favorites.characters
	console.log({ uMeta })
	return
}