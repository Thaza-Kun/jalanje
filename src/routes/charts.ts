import type { DistanceProp, Props } from "./types";

export const toChartData = (timeline: Props<DistanceProp<number | null>>) => {
  return {
    labels: timeline.data.departures,
    datasets: [
      {
        yAxisID: "yax",
        xAxisID: "xax",
        // TODO: Get human readable name
        label: "Rumah -> Kerja",
        data: timeline.data.routes.map((r) =>
          r.duration ? r.duration / 60 : r.duration,
        ),
      },
    ],
  };
};
