import create from "zustand";

type DockerLogsPageStoreType = {
  filters: {
    containerName: string;
    logContent: string;
    limit: number; // minutes, 0 === inf
  };
  containers: string[];
  selectedContainers: string[];
};

const dockerLogsStore = create<DockerLogsPageStoreType>()(
  (setState, getState, store) => {
    return {
      containers: ["captime-backend", "captime-frontend", "captime-proxy"],
      filters: {
        containerName: "",
        limit: 0,
        logContent: "",
      },
      selectedContainers: ["hah"],
    };
  }
);

export default function LogsPage() {
  return (
    <div className="mt-48 flex flex-1 flex-col items-center">
      <Filters />
    </div>
  );
}

const Filters = () => {
  const containers = dockerLogsStore((state) => state.containers);
  const selectedContainers = dockerLogsStore(
    (state) => state.selectedContainers
  );

  return (
    <div className="flex w-1/2 items-center gap-3 shadow-xl">
      <div className="dropdown-bottom dropdown">
        <label tabIndex={0} className="btn m-1 w-[150px] ">
          {selectedContainers.length === 0
            ? "All containers "
            : `${selectedContainers.length} container`}
        </label>

        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box  bg-base-100 p-2 shadow-md shadow-secondary"
        >
          <input className="input w-min" placeholder="Search" autoFocus />
          <div className="mb-2 border-b p-1"></div>
          {containers.map((c) => {
            return (
              <div className="form-control " key={c}>
                <label className="label flex cursor-pointer items-start">
                  <input type="checkbox" checked className="checkbox" />
                  <span className="label-text">{c}</span>
                </label>
              </div>
            );
          })}
        </ul>
      </div>
      <input className="input" placeholder="Filter by content" />
    </div>
  );
};
