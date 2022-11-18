import { type AppType } from "next/dist/shared/lib/utils";
import { useRouter } from "next/router";

import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="flex h-screen w-screen flex-col">
      <Header />
      <div className="flex flex-1 flex-col">
        <Component {...pageProps} />
      </div>
    </div>
  );
};

const Header = () => {
  const router = useRouter();
  return (
    <div className="flex w-full justify-between p-6">
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
      <button className="btn-ghost btn">logout</button>
    </div>
  );
};

export default MyApp;
