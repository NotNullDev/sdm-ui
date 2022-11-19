import { type NextPage } from "next";
import { useEffect } from "react";
import { pocketbase } from "../lib/pocketbase";
import { userStore } from "../lib/userStore";

const Home: NextPage = () => {
  useEffect(() => {
    (async function () {
      try {
        const auth = await pocketbase.users.listAuthMethods();
        console.log("auth list: ", auth);
      } catch (e) {}
    })();
  }, []);
  return (
    <div className="mt-48 flex flex-1 flex-col items-center">
      <button
        className="btn-primary btn"
        onClick={() => {
          userStore.getState().login();
        }}
      >
        login
      </button>
    </div>
  );
};

export default Home;
