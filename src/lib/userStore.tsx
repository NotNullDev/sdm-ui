import type { Admin, User } from "pocketbase";
import create from "zustand";
import { pocketbase } from "./pocketbase";

export type UserStoreType = {
  user: User | Admin | undefined;
  login: () => void;
};

export const userStore = create<UserStoreType>()(
  (setState, getState, store) => {
    const login = async () => {
      const authMethods = await pocketbase.users.listAuthMethods();
      const googleProvider = authMethods.authProviders.find(
        (p) => p.name === "google"
      );

      const userAuthData2 = await pocketbase.users.authViaOAuth2(
        "google",
        googleProvider?.codeChallenge ?? "",
        "",
        "REDIRECT_URL"
      );
    };

    return {
      user: undefined,
      login,
    };
  }
);
