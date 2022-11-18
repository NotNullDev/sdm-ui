import { type NextPage } from "next";
import { useEffect } from "react";
import { pocketbase } from "../lib/pocketbase";

const Home: NextPage = () => {
  useEffect(() => {
    (async function () {
      console.log(await pocketbase.users.listAuthMethods());
    })();
  }, []);
  return <div className="mt-48 flex flex-1 flex-col items-center"></div>;
};

export default Home;
