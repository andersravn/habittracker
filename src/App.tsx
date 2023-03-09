import { useLocalStorage } from "./hooks/useLocalStorage";
import { useState } from "react";
import LineChart from "./components/LineChart";
import { ExportButton } from "./components/ExportButton";
import { ImportButton } from "./components/ImportButton";

export default function App() {
  const [redButtonLabel, setRedButtonLabel] = useLocalStorage(
    "redButton",
    "Did not do it"
  );
  const [greenButtonLabel, setGreenButtonLabel] = useLocalStorage(
    "greenButton",
    "Did it"
  );
  const [editMode, setEditMode] = useState(false);
  const [editRedCount, setEditRedCount] = useState(false);
  const [editGreenCount, setEditGreenCount] = useState(false);

  const today = new Date(Date.now()).toLocaleDateString();
  const [stats, setStats] = useLocalStorage("myStats", {
    [today]: {
      red: 0,
      green: 0,
    },
  });

  function updateStat(color: string) {
    if (!stats[today]) {
      setStats({
        ...stats,
        [today]: {
          red: color === "red" ? 1 : 0,
          green: color === "green" ? 1 : 0,
        },
      });
    }
    setStats({
      ...stats,
      [today]: { ...stats[today], [color]: stats[today][color] + 1 },
    });
  }

  function updateRedCount(event: any) {
    try {
      const newCount = Number(event.target.value);
      setStats({
        ...stats,
        [today]: { ...stats[today], ["red"]: newCount },
      });
      setEditRedCount(false);
    } catch (e) {
      console.log(e);
    }
  }

  function updateGreenCount(event: any) {
    try {
      const newCount = Number(event.target.value);
      setStats({
        ...stats,
        [today]: { ...stats[today], ["green"]: newCount },
      });
      setEditGreenCount(false);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="flex flex-col space-y-4 justify-center items-center">
      <div className="mt-20 flex items-start flex-col md:flex-row max-md:space-y-4 md:space-x-4">
        {editMode ? (
          <input
            type="text"
            placeholder={redButtonLabel}
            onChange={(event) => setRedButtonLabel(event.target.value)}
            className="bg-red-500 px-5 py-4 rounded placeholder-slate-200 w-[200px] text-lg font-extrabold"
          />
        ) : (
          <div className="flex relative justify-between md:flex-col md:items-center">
            <button
              onClick={() => updateStat("red")}
              className={`bg-red-500 py-4 min-w-[200px] text-lg font-extrabold text-slate-50 rounded px-5 ${
                editRedCount && "rounded-r-none"
              }`}
            >
              {redButtonLabel}
            </button>
            {editRedCount ? (
              <input
                type="number"
                autoFocus
                className="w-12 text-2xl text-center border-red-500 border-2 rounded-r"
                defaultValue={stats[today]?.red}
                onBlur={updateRedCount}
              />
            ) : (
              <div
                onClick={() => setEditRedCount(!editRedCount)}
                className="text-2xl text-cyan-600 max-md:ml-4 mt-4 font-bold"
              >
                {stats[today]?.red ?? 0}
              </div>
            )}
          </div>
        )}

        {editMode ? (
          <input
            type="text"
            placeholder={greenButtonLabel}
            onChange={(event) => setGreenButtonLabel(event.target.value)}
            className="bg-green-500 px-5 py-4 rounded placeholder-slate-200 w-[200px] text-lg font-extrabold"
          />
        ) : (
          <div className="flex justify-between md:flex-col md:items-center">
            <button
              onClick={() => updateStat("green")}
              className={`bg-green-500 py-4 min-w-[200px] text-lg font-extrabold text-slate-50 px-5 rounded ${
                editGreenCount && "rounded-r-none"
              }`}
            >
              {greenButtonLabel}
            </button>
            {editGreenCount ? (
              <input
                type="number"
                autoFocus
                className="w-12 text-2xl text-center border-green-500 border-2 rounded-r"
                defaultValue={stats[today]?.green}
                onBlur={updateGreenCount}
              />
            ) : (
              <div
                onClick={() => setEditGreenCount(!editGreenCount)}
                className="text-2xl text-cyan-600 max-md:ml-4 mt-4 font-bold"
              >
                {stats[today]?.green ?? 0}
              </div>
            )}
          </div>
        )}
      </div>
      <div>
        <button
          className="relative text-cyan-600 text-sm right-14"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Done" : "Edit button texts"}
        </button>
      </div>
      <LineChart stats={stats} />
      <ExportButton />
      <ImportButton />
    </div>
  );
}
