import type { RecordSubscription } from "pocketbase";
import { useEffect } from "react";
import toast from "react-hot-toast";
import create from "zustand";
import { pocketbase } from "../lib/pocketbase";

type Log = {
  id: number;
  containerName: string;
  logContent: string;
  containerId: string;
};

type DockerLogsPageStoreType = {
  filters: {
    containerName: string;
    logContent: string;
    limit: number; // minutes, 0 === inf
  };
  containers: string[];
  composes: string[];
  selectedContainers: string[];
  subscribeToLogs: () => void;
  unsubscribeFromLogs: () => void;
};

const dockerLogsStore = create<DockerLogsPageStoreType>()(
  (setState, getState, store) => {
    let unsub: (() => void) | null = null;

    const subscribeToLogs = async () => {
      if (unsub) return;
      const unsubscribe = await pocketbase
        .collection("logs")
        .subscribe("*", (log: RecordSubscription<Log>) => {
          console.log("new log!");
          toast("received new log!");
        });
      toast("subscribed to logs");
      // setInterval(() => {
      //   pocketbase.collection("logs").create({
      //     logContent: "haha!",
      //   } as Log);
      // }, 5000);
      unsub = unsubscribe;
    };

    const unsubscribeFromLogs = () => {
      if (unsub) {
        unsub();
      }
    };

    const refetchContainerNames = async () => {
      const resp = await fetch(pocketbase.baseUrl + "/app/containers");

      if (!resp.ok) {
        toast("Could not fetch container names!");
        return;
      }

      const data = (await resp.json()) as string[];

      setState((old) => ({ ...old, containers: data }));
    };
    const refetchComposesNames = async () => {
      const resp = await fetch(pocketbase.baseUrl + "/app/composes");

      if (!resp.ok) {
        toast("Could not fetch composes names!");
        return;
      }

      const data = (await resp.json()) as string[];

      setState((old) => ({ ...old, composes: data }));
    };

    refetchComposesNames();
    refetchContainerNames();
    return {
      containers: ["captime-backend", "captime-frontend", "captime-proxy"],
      filters: {
        containerName: "",
        limit: 0,
        logContent: "",
      },
      selectedContainers: [],
      subscribeToLogs,
      unsubscribeFromLogs,
      composes: [],
    };
  }
);

export default function LogsPage() {
  useEffect(() => {
    return () => {
      dockerLogsStore.getState().unsubscribeFromLogs();
    };
  }, []);
  return (
    <div className="mt-48 flex flex-1 flex-col items-center">
      <Filters />
    </div>
  );
}

const Filters = () => {
  const containers = dockerLogsStore((state) => state.containers);
  const composes = dockerLogsStore((state) => state.composes);
  const selectedContainers = dockerLogsStore(
    (state) => state.selectedContainers
  );

  return (
    <div className="flex w-1/2 items-center justify-between gap-3 shadow-xl">
      <div className="flex gap-3">
        {
          // containers
          <div className="dropdown-bottom dropdown">
            <label tabIndex={0} className="btn m-1 w-[150px]">
              {selectedContainers.length === 0
                ? "All containers "
                : `${selectedContainers.length} container`}
            </label>

            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box  mt-1 bg-base-100 p-2 shadow-md shadow-secondary"
            >
              <input className="input w-min" placeholder="Search" autoFocus />
              <div className="mb-2 border-b p-1"></div>
              {containers.map((c) => {
                return (
                  <div className="form-control " key={c}>
                    <label className="label flex cursor-pointer items-start">
                      <input type="checkbox" className="checkbox" />
                      <span className="label-text">{c}</span>
                    </label>
                  </div>
                );
              })}
            </ul>
          </div>
        }
        {
          //composes
          <div className="dropdown-bottom dropdown">
            <label tabIndex={0} className="btn m-1 w-[150px]">
              {selectedContainers.length === 0
                ? "All composes "
                : `${selectedContainers.length} composes`}
            </label>

            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box  mt-1 bg-base-100 p-2 shadow-md shadow-secondary"
            >
              <input className="input w-min" placeholder="Search" autoFocus />
              <div className="mb-2 border-b p-1"></div>
              {composes.map((c) => {
                return (
                  <div className="form-control " key={c}>
                    <label className="label flex cursor-pointer items-start">
                      <input type="checkbox" className="checkbox" />
                      <span className="label-text">{c}</span>
                    </label>
                  </div>
                );
              })}
            </ul>
          </div>
        }

        <input className="input" placeholder="Filter by content" />
      </div>
      <button
        className="btn-primary btn"
        onClick={() => dockerLogsStore.getState().subscribeToLogs()}
      >
        show
      </button>
    </div>
  );
};
