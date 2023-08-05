import { useLocalStorage } from "./hooks/useLocalStorage";
import { useState } from "react";
import LineChart from "./components/LineChart";
import { ExportButton } from "./components/ExportButton";
import { ImportButton } from "./components/ImportButton";
import { formatDate } from "./utils/formatDate";
import { getClickTime } from "./utils/getClickTime";

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

  const [daysToShow, setDaysToShow] = useState(-30);
  const date = new Date(Date.now());
  const today = formatDate(date);
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

    console.log(_stats);

    _stats = {
      ..._stats,
      [today]: {
        ..._stats[today],
        [color]: [..._stats[today][color], getClickTime()],
      },
    };
    console.log(_stats);

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
      <LineChart stats={stats} daysToShow={daysToShow} />
      <div className="space-x-4">
        <button
          className="text-cyan-600 text-sm"
          onClick={() => setDaysToShow(-7)}
        >
          7 days
        </button>
        {Object.keys(stats).length > 6 && (
          <button
            className="text-cyan-600 text-sm"
            onClick={() => setDaysToShow(-14)}
          >
            14 days
          </button>
        )}
        {Object.keys(stats).length > 13 && (
          <button
            className="text-cyan-600 text-sm"
            onClick={() => setDaysToShow(-30)}
          >
            30 days
          </button>
        )}
        {Object.keys(stats).length > 29 && (
          <button
            className="text-cyan-600 text-sm"
            onClick={() => setDaysToShow(-365)}
          >
            365 days
          </button>
        )}
      </div>
      <ExportButton />
      <ImportButton />
    </div>
  );
}
