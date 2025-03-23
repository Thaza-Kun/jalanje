import type { DistanceProp, Props } from "./types";

export const toChartData = (timeline: Props<DistanceProp<number | null>>[]) => {
  let means = timeline.map((tl) => {
    return (
      tl.routes.reduce(
        (acc, curr) => (curr.duration ? acc + curr.duration : acc),
        0,
      ) / tl.routes.reduce((acc, curr) => (curr.distance ? acc + 1 : acc), 0)
    ); // length of non nulls
  });
  return {
    labels: timeline[0].departures,
    datasets: timeline.map((tl, idx) => {
      return {
        yAxisID: "yax",
        xAxisID: "xax",
        label:
          tl.origin.name +
          " -> " +
          tl.destination.name +
          " (" +
          (means[idx] / 3600).toFixed(2) +
          " jam)",
        data: tl.routes.map((r) =>
          r.duration ? (means[idx] - r.duration) / 3600 : null,
        ),
      };
    }),
  };
};
