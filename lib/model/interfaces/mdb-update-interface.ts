// mdb-update-interface.ts
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { UserSchema, INCharacter, UserDecoration } from "@types";
import { MongoConnector } from "@model";
import { DATABASE_STRING as databaseName } from "./constants";

/* public */
export const addToFavorites = async ({
  email = "",
  cid = undefined,
  type = "characters",
}: {
  email: UserSchema["email"];
  cid: number;
  type?: string;
}) => {
  const collection = await getUserCollection();
  const query = `rickmorty.favorites.${type}`;
  const user = await collection.updateOne(
    { email },
    { $addToSet: { [query]: cid } },
  );
  return user;
};
