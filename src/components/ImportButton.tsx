import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export function ImportButton() {
  const [showForm, setShowForm] = useState(false);
  const [csv, setCSV] = useState("");
  const today = new Date(Date.now()).toLocaleDateString();
  const [_, setStats] = useLocalStorage("myStats", {
    [today]: {
      red: [],
      green: [],
    },
  });

  function save() {
    if (csv.length < 10) {
      setShowForm(false);
      return;
    }
    const confirmed = confirm(
      "This will overwrite all you current data. Are you sure?"
    );
    if (confirmed) {
      try {
        let stats = {};
        const rows = csv.split("\n").slice(1);
        if (rows.length < 1) {
          stats = {
            ...stats,
            [today]: {
              red: 0,
              green: 0,
            },
          };
        }
        rows.forEach((row) => {
          const items = row.split(",");
          if (
            items.length !== 3 ||
            items[0] === undefined ||
            items[1] === undefined ||
            items[2] === undefined
          ) {
            throw new Error("Data is incorrect");
          }
          stats = {
            ...stats,
            [items[0]]: {
              red: Number(items[1]),
              green: Number(items[2]),
            },
          };
        });
        console.log(stats);
        setStats(stats);
        window.location.reload();
        setShowForm(false);
      } catch (e) {
        console.error(e);
        alert("Something went wrong. Please upload the correct CSV data.");
      }
    }
  }

  return (
    <div>
      {showForm ? (
        <div className="flex flex-col items-start">
          <textarea
            className="border-2"
            rows={5}
            onChange={(event) => setCSV(event.target.value.trim())}
            value={csv}
          ></textarea>
          <button
            className="px-3 mb-10 rounded mt-4 py-2 bg-sky-500 text-slate-200 font-bold"
            onClick={save}
          >
            Save
          </button>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)} className="p-4 text-cyan-600">
          Import data
        </button>
      )}
    </div>
  );
}
