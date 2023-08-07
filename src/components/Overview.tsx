import { useState } from "react";
import LineChart from "./OverviewLineChart";
import { useStats } from "../hooks/useStats";

export default function Overview() {
  const [daysToShow, setDaysToShow] = useState(-30);
  const { stats } = useStats();

  return (
    <>
      <LineChart stats={stats} daysToShow={daysToShow} />
      <div className="space-x-4">
        <button
          className={`text-cyan-600 text-sm ${
            daysToShow === -7 && "font-bold"
          }`}
          onClick={() => setDaysToShow(-7)}
        >
          Last 7 days
        </button>
        {Object.keys(stats).length > 6 && (
          <button
            className={`text-cyan-600 text-sm ${
              daysToShow === -14 && "font-bold"
            }`}
            onClick={() => setDaysToShow(-14)}
          >
            Last 14 days
          </button>
        )}
        {Object.keys(stats).length > 13 && (
          <button
            className={`text-cyan-600 text-sm ${
              daysToShow === -30 && "font-bold"
            }`}
            onClick={() => setDaysToShow(-30)}
          >
            Last 30 days
          </button>
        )}
        {Object.keys(stats).length > 29 && (
          <button
            className={`text-cyan-600 text-sm ${
              daysToShow === -90 && "font-bold"
            }`}
            onClick={() => setDaysToShow(-365)}
          >
            365 days
          </button>
        )}
      </div>
    </>
  );
}
