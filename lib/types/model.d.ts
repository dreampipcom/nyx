// model.d.ts
import type { User } from "next-auth";
import type { INCharacter } from "@types";

export interface UserSchema extends User {
  rickmorty: {
    favorites: {
      characters: INCharacter[];
    };
  };
}
