import { type NextPage } from "next";
import { userStore } from "../lib/userStore";
type TextDangerProps = {
  text: string;
};

const TextDanger = ({ text }: TextDangerProps) => {
  return <span className="font-bold  text-red-400">{text}</span>;
};

const Home: NextPage = () => {
  const currentUser = userStore((state) => state.user);
  return (
    <>
      <div className="mt-48 flex flex-1 flex-col items-center">
        {!currentUser && (
          <button
            className="btn-primary btn"
            onClick={() => {
              userStore.getState().login();
            }}
          >
            login
          </button>
        )}
        {currentUser && (
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-3xl font-bold">Welcome back</h2>
            <div>
              <span className="text-2xl">{currentUser.email}</span>
            </div>
            <div>
              There was {<TextDanger text="3" />} errors caught in{" "}
              {<TextDanger text="1" />} application until your last visit.
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
