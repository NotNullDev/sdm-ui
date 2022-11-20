import { type AppType } from "next/dist/shared/lib/utils";
import { useRouter } from "next/router";
import type { Admin, Record } from "pocketbase";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { userStore } from "../lib/userStore";

import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="flex h-screen w-screen flex-col">
      <Guard>
        <Header />
        <div className="flex flex-1 flex-col">
          <Component {...pageProps} />
        </div>
      </Guard>
    </div>
  );
};

type GuardProps = {
  children: React.ReactNode;
};
const Guard = ({ children }: GuardProps) => {
  const [user, setUser] = useState<Record | Admin | null>(null);
  const currentUser = userStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    setUser(currentUser);
    toast("current user updated");
    if (!currentUser) {
      toast("current user is null");
    }
  }, [currentUser]);

  if (!user) {
    return <LoginComponent />;
  }

  return <>{children}</>;
};

const Header = () => {
  const router = useRouter();
  return (
    <div className="flex w-full justify-between p-6">
      <Toaster />
      <div className="flex items-center gap-2">
        <div
          className="cursor-pointer text-2xl"
          onClick={() => {
            router.push("/");
          }}
        >
          Deployment manager
        </div>
        <button
          className="btn-ghost btn"
          onClick={() => {
            router.push("/logs");
          }}
        >
          Logs
        </button>
      </div>
      <button
        className="btn-ghost btn"
        onClick={() => {
          userStore.getState().logout();
        }}
      >
        logout
      </button>
    </div>
  );
};

const LoginComponent = () => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <button
        className="btn-primary btn"
        onClick={() => {
          userStore.getState().login();
        }}
      >
        LOGIN
      </button>
    </div>
  );
};

export default MyApp;
