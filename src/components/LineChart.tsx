import { useMemo } from "react";
import { AxisOptions, Chart } from "react-charts";
import { ErrorBoundary } from "react-error-boundary";

type DailyPushes = {
  date: string;
  pushes: number;
};

type Series = {
  label: string;
  data: DailyPushes[];
};

export default function App({ stats }: { stats: any }) {
  const primaryAxis = useMemo(
    (): AxisOptions<DailyPushes> => ({
      getValue: (datum) => datum.date,
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
      data: Object.keys(stats).map((date) => ({
        date,
        pushes: stats[date].red ?? 0,
      })),
    },
    {
      label: "Green",
      data: Object.keys(stats).map((date) => ({
        date,
        pushes: stats[date].green ?? 0,
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
            data,
            primaryAxis,
            secondaryAxes,
            defaultColors: ["rgb(239 68 68)", "rgb(34 197 94)"],
          }}
        />
      </ErrorBoundary>
    </div>
  );
}
