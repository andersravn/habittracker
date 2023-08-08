import { useLocalStorage } from "./hooks/useLocalStorage";
import { useState } from "react";
import { ExportButton } from "./components/ExportButton";
import { ImportButton } from "./components/ImportButton";
import { getClickTime } from "./utils/getClickTime";
import Overview from "./components/Overview";
import { Days } from "./components/Days";
import { useStats } from "./hooks/useStats";
import { formatDate } from "./utils/formatDate";

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

  const [view, setView] = useState<"overview" | "days">("overview");

  const date = new Date(Date.now());
  const today = formatDate(date, ".");
  const [stats, setStats] = useLocalStorage("myStats", {
    [today]: {
      red: [],
      green: [],
    },
  });

  function updateStat(color: string) {
    let _stats = { ...stats };
    if (!_stats[today] || typeof _stats[today][color] === "number") {
      _stats = {
        ..._stats,
        [today]: {
          red: color === "red" ? [getClickTime()] : [],
          green: color === "green" ? [getClickTime()] : [],
        },
      };
    }

    _stats = {
      ..._stats,
      [today]: {
        ..._stats[today],
        [color]: [..._stats[today][color], getClickTime()],
      },
    };

    setStats(_stats);
  }

  function undoRedCount() {
    try {
      setStats({
        ...stats,
        [today]: { ...stats[today], ["red"]: stats[today]["red"].slice(0, -1) },
      });
    } catch (e) {
      console.log(e);
    }
  }

  function undoGreenCount() {
    try {
      setStats({
        ...stats,
        [today]: {
          ...stats[today],
          ["green"]: stats[today]["green"].slice(0, -1),
        },
      });
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
              className={`bg-red-500 py-4 min-w-[200px] text-lg font-extrabold text-slate-50 rounded px-5`}
            >
              {redButtonLabel}
            </button>
            {
              <div
                onClick={() => undoRedCount()}
                className="text-2xl text-cyan-600 max-md:ml-4 mt-4 font-bold"
              >
                {stats[today]?.red.length ?? stats[today]?.red ?? 0}
              </div>
            }
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
              className={`bg-green-500 py-4 min-w-[200px] text-lg font-extrabold text-slate-50 px-5 rounded`}
            >
              {greenButtonLabel}
            </button>
            {
              <div
                onClick={() => undoGreenCount()}
                className="text-2xl text-cyan-600 max-md:ml-4 mt-4 font-bold"
              >
                {stats[today]?.green.length ?? stats[today]?.green ?? 0}
              </div>
            }
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
      <div className="space-x-8">
        <button
          className={`text-cyan-600 text-sm ${
            view === "overview" && "font-bold"
          }`}
          onClick={() => setView("overview")}
        >
          Overview
        </button>
        <button
          className={`text-cyan-600 text-sm ${view === "days" && "font-bold"}`}
          onClick={() => setView("days")}
        >
          Days
        </button>
      </div>
      {view === "days" ? <Days stats={stats} /> : <Overview stats={stats} />}
      <ExportButton />
      <ImportButton />
    </div>
  );
}
