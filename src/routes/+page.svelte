<script lang="ts">
    import {
        Chart,
        type ChartData,
        type ChartItem,
        type ChartOptions,
    } from "chart.js/auto";
    import "chartjs-adapter-moment";
    import { onMount } from "svelte";
    import type { Props, RouteResponseProp, DistanceProp } from "./types.ts";
    import { toChartData } from "./charts.ts";

    let response: Props<RouteResponseProp> = $props();

    onMount(() => {
        let timeline: Props<DistanceProp<number | null>> = {
            data: {
                ...response.data,
                routes: response.data.routes.map((a) =>
                    a.routes
                        ? {
                              distance: a.routes[0].distanceMeters,
                              duration: Number(
                                  a.routes[0].duration.replace("s", ""),
                              ),
                          }
                        : { distance: null, duration: null },
                ),
            },
        };
        const ctx = document.getElementById("lineChart");
        const chartData: ChartData = toChartData(timeline);
        const chartOptions: ChartOptions = {
            scales: {
                yax: {
                    title: {
                        display: true,
                        text: "Tempoh perjalanan (min)",
                    },
                },
                xax: {
                    type: "time",
                    title: {
                        display: true,
                        text: "Masa bertolak (jam)",
                    },
                },
            },
        };
        let c = new Chart(ctx as ChartItem, {
            type: "line",
            data: chartData,
            options: chartOptions,
        });
    });
</script>

<svelte:head>
    <title>Map</title>
</svelte:head>

<!-- TODO: CSS styling -->
<section>
    <canvas id="lineChart"></canvas>
</section>
