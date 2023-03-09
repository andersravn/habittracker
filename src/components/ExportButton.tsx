import { useState } from "react";
import useCopyToClipboard from "../hooks/useCopyToClipboard";
import { useLocalStorage } from "../hooks/useLocalStorage";

export function ExportButton() {
  const [_, copy] = useCopyToClipboard();
  const today = new Date(Date.now()).toLocaleDateString();
  const [copiable, setCopiable] = useState("");
  const [stats] = useLocalStorage("myStats", {
    [today]: {
      red: 0,
      green: 0,
    },
  });

  function exportStats() {
    let exportString = "date,red,green\n";
    let data = Object.keys(stats).map(
      (date) => `${date},${stats[date].red},${stats[date].green}\n`
    );
    data.forEach((day) => {
      exportString += day;
    });
    console.log(exportString);
    setCopiable(exportString);
    copy(exportString).then(() => {
      alert(
        "Copied data as CSV to your clipboard. (If it didn't work, you can copy it manually below the export button.)"
      );
    });
  }

  return (
    <div className="flex flex-col">
      <button className="p-4 text-cyan-600" onClick={exportStats}>
        Export data
      </button>
      {copiable && (
        <textarea
          className="border-2"
          defaultValue={copiable?.trim() as string}
          rows={5}
        ></textarea>
      )}
    </div>
  );
}
