import { useMemo } from "react";
import { AxisOptions, Chart } from "react-charts";
import { ErrorBoundary } from "react-error-boundary";
import { eachDayOfInterval, subDays } from "date-fns";
import { formatDate } from "../utils/formatDate";

type DailyPushes = {
  date: string;
  pushes: number;
};

type Series = {
  label: string;
  data: DailyPushes[];
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function App({
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
      data: days.map((date) => ({
        date: formatDate(date),
        pushes:
          stats[formatDate(date)]?.red.length ??
          stats[formatDate(date)]?.red ??
          0,
      })),
    },
    {
      label: "Green",
      data: days.map((date) => ({
        date: formatDate(date),
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
