import { useEffect, useMemo, useState } from "react";
import { useStats } from "../hooks/useStats";
import { ErrorBoundary } from "react-error-boundary";
import { AxisOptions, Chart } from "react-charts";
import { isSameHour, setHours } from "date-fns";

type DailyPushes = {
  time: string;
  pushes: number;
};

type Series = {
  label: string;
  data: DailyPushes[];
};

export function Days() {
  const { stats } = useStats();
  const [selectedDay, selectDay] = useState("");

  useEffect(() => {
    if (selectedDay === "") {
      selectDay(Object.keys(stats)[Object.keys(stats).length - 1]);
    }
  }, [stats]);

  useEffect(() => {
    console.log(stats[selectedDay]);
  }, [selectedDay]);

  const hoursInDay = useMemo(
    (): number[] => [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23,
    ],
    []
  );
  const primaryAxis = useMemo(
    (): AxisOptions<DailyPushes> => ({
      getValue: (datum) => {
        // const hour = hoursInDay[new Date(datum.time).getTime()];
        return datum.time;
      },
    }),
    []
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<DailyPushes>[] => [
      {
        getValue: (datum) => Number(datum.pushes),
        elementType: "line",
      },
    ],
    []
  );

  const data: Series[] = [
    {
      label: "Red",
      data: hoursInDay.map((hour) => ({
        time: setHours(new Date(selectedDay), hour).toLocaleTimeString(),
        pushes:
          stats[selectedDay]?.red?.filter((push: string) => {
            const pushDate = new Date(push);
            const pushDateWithSpecificHour = new Date(
              pushDate.getFullYear(),
              pushDate.getMonth(),
              pushDate.getDate(),
              hour
            );
            return isSameHour(pushDate, pushDateWithSpecificHour);
          }).length ?? 0,
      })),
    },
    {
      label: "Green",
      data: hoursInDay.map((hour) => ({
        time: setHours(new Date(selectedDay), hour).toLocaleTimeString(),
        pushes:
          stats[selectedDay]?.green?.filter((push: string) => {
            const pushDate = new Date(push);
            const pushDateWithSpecificHour = new Date(
              pushDate.getFullYear(),
              pushDate.getMonth(),
              pushDate.getDate(),
              hour
            );
            return isSameHour(pushDate, pushDateWithSpecificHour);
          }).length ?? 0,
      })),
    },
  ];

  return (
    <div className="w-full">
      <div className="relative aspect-square h-96">
        <ErrorBoundary
          fallbackRender={() => (
            <div className="text-red-700">Could not render chart...</div>
          )}
        >
          <Chart
            options={{
              data: data,
              primaryAxis,
              secondaryAxes,
              defaultColors: ["rgb(239 68 68)", "rgb(34 197 94)"],
            }}
          />
        </ErrorBoundary>
      </div>
      <ul className="space-y-2">
        {Object.keys(stats)
          .filter((day) => stats[day].red.length && stats[day].green.length)
          .reverse()
          .map((day) => {
            return (
              <li
                key={day}
                className={`text-cyan-600 ${
                  selectedDay === day && "font-bold"
                }`}
              >
                <button onClick={() => selectDay(day)}>{day}</button>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
