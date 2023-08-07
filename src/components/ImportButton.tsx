import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export function ImportButton() {
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState("");
  const today = new Date(Date.now()).toLocaleDateString();
  const [_, setStats] = useLocalStorage("myStats", {
    [today]: {
      red: [],
      green: [],
    },
  });

  function save() {
    if (data.length < 10) {
      setShowForm(false);
      return;
    }
    const confirmed = confirm(
      "This will overwrite all your current data. Are you sure?"
    );
    if (confirmed) {
      try {
        console.log(data);
        setStats(JSON.parse(data));
        window.location.reload();
        setShowForm(false);
      } catch (e) {
        console.error(e);
        alert("Something went wrong. Please upload the correct JSON data.");
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
            onChange={(event) => setData(event.target.value.trim())}
            value={data}
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
