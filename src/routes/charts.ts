import type { DistanceProp, Props } from "./types";

export const toChartData = (timeline: Props<DistanceProp<number>>[]) => {
  return {
    labels: timeline[0].departures,
    datasets: timeline.map((tl) => {
      return {
        yAxisID: "yax",
        xAxisID: "xax",
        // TODO: Get human readable name
        label: tl.origin.name + "->" + tl.destination.name,
        data: tl.routes.map((r) =>
          r.duration ? r.duration / 3600 : r.duration,
        ),
      };
    }),
  };
};
