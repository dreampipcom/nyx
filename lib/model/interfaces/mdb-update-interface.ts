// mdb-update-interface.ts
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { UserSchema, INCharacter, UserDecoration } from "@types";
import { NexusInterface } from "./mdb-init-interface"
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
  console.log("---- update iface ----")
  const Nexus = await NexusInterface
  const user = await Nexus.updateUser({ email, query: `rickmorty.favorites.${type}`, value: cid})
  return user
};


export const initUser = async ({
  email = "",
}: {
  email: UserSchema["email"];
}) => {
  const Nexus = await NexusInterface
  const user = await Nexus.initUser({ email })
  return user
};