import type {
  Admin,
  AuthMethodsList,
  AuthProviderInfo,
  Record,
} from "pocketbase";
import toast from "react-hot-toast";
import create from "zustand";
import { pocketbase } from "./pocketbase";

export type UserStoreType = {
  user: Record | Admin | null;
  login: () => void;
  logout: () => void;
};

const redirectUri = "http://localhost:3000";

const startChallenge = (provider?: AuthProviderInfo) => {
  if (!provider) {
    toast("started auth challenge without valid url!");
  }

  const googleUrl = provider?.authUrl + redirectUri;
  const loginPopup = window.open(googleUrl, "Login", "popup");

  const windowCheck = setInterval(() => {
    if (loginPopup?.closed) {
      toast("Login failed!");
      clearInterval(windowCheck);
    }

    let popupHref = "";

    try {
      popupHref = loginPopup?.location.href ?? "";
      if (popupHref.includes("blank")) {
        return; // not open yet
      }
    } catch (e) {
      return; // window is in another domain - google will redirect to our url when login will be done
    }

    const params = new URL(popupHref).searchParams;

    const code = params.get("code") ?? "";
    const state = params.get("state") ?? "";

    if (state !== provider?.state) {
      toast("hmmm... state mismatch!");
      return;
    }

    // console.log("code: " + code);
    // toast(code);

    pocketbase
      .collection("users")
      .authWithOAuth2("google", code, provider.codeVerifier, redirectUri);

    loginPopup?.close();
    clearInterval(windowCheck);
  }, 200);
};

export const userStore = create<UserStoreType>()(
  (setState, _getState, store) => {
    const initUser = pocketbase.authStore.model;

    pocketbase.authStore.onChange((token, model) => {
      if (model) {
        setState((old) => ({ ...old, user: model }));
      }
    }, true);

    const login = async () => {
      let authMethods: AuthMethodsList | null = null;

      try {
        authMethods = await pocketbase.collection("users").listAuthMethods();
      } catch (e) {
        console.log(e);
        return;
      }

      const googleProvider = authMethods.authProviders.find(
        (p) => p.name === "google"
      );

      startChallenge(googleProvider);
    };

    const logout = () => {
      setState((old) => ({ ...old, user: null }));
      pocketbase.authStore.clear();
    };

    return {
      user: initUser,
      login,
      logout,
    };
  }
);
