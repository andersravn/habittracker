import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export function ExportButton() {
  const today = new Date(Date.now()).toLocaleDateString();
  const [doExport, setExport] = useState(false);
  const [stats] = useLocalStorage("myStats", {
    [today]: {
      red: [],
      green: [],
    },
  });

  return (
    <div className="flex flex-col">
      <button className="p-4 text-cyan-600" onClick={() => setExport(true)}>
        Export data
      </button>
      {doExport && (
        <textarea
          className="border-2"
          defaultValue={JSON.stringify(stats)}
          rows={5}
        ></textarea>
      )}
    </div>
  );
}
