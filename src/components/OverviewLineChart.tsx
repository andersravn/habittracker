import { useEffect, useMemo } from "react";
import { AxisOptions, Chart } from "react-charts";
import { ErrorBoundary } from "react-error-boundary";
import { eachDayOfInterval, subDays } from "date-fns";
import { formatDate } from "../utils/formatDate";

type DailyPushes = {
  date: Date;
  pushes: number;
};

type Series = {
  label: string;
  data: DailyPushes[];
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function OverviewLineChart({
  stats,
  daysToShow,
}: {
  stats: any;
  daysToShow: number;
}) {
  const days = eachDayOfInterval({
    start: subDays(new Date(), Math.abs(daysToShow) - 1),
    end: new Date(),
  });

  const primaryAxis = useMemo(
    (): AxisOptions<DailyPushes> => ({
      getValue: (datum) => {
        const weekDay = weekDays[new Date(datum.date).getDay()];
        return `${weekDay} ${new Date(datum.date).toLocaleDateString()}`;
      },
    }),
    [stats]
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<DailyPushes>[] => [
      {
        getValue: (datum) => Number(datum.pushes),
        elementType: "line",
      },
    ],
    [stats]
  );

  const data: Series[] = [
    {
      label: "Red",
      data: days.map((date) => ({
        date: date,
        pushes:
          stats[formatDate(date)]?.red.length ??
          stats[formatDate(date)]?.red ??
          0,
      })),
    },
    {
      label: "Green",
      data: days.map((date) => ({
        date: date,
        pushes:
          stats[formatDate(date)]?.green.length ??
          stats[formatDate(date)]?.green ??
          0,
      })),
    },
  ];

  return (
    <div className="relative aspect-square h-96">
      <ErrorBoundary
        fallbackRender={() => (
          <div className="text-red-700">Could not render chart...</div>
        )}
      >
        <Chart
          options={{
            data: data.slice(-7),
            primaryAxis,
            secondaryAxes,
            defaultColors: ["rgb(239 68 68)", "rgb(34 197 94)"],
          }}
        />
      </ErrorBoundary>
    </div>
  );
}
