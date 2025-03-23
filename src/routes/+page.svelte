<script lang="ts">
    import {
        Chart,
        type ChartData,
        type ChartItem,
        type ChartOptions,
    } from "chart.js/auto";
    import "chartjs-adapter-moment";
    import { onMount } from "svelte";
    import type {
        Props,
        RouteResponseProp,
        DistanceProp,
        DistanceResponseProp,
    } from "./types.ts";
    import { toChartData } from "./charts.ts";

    interface ResponseProp {
        data: Data;
        // error?: {
        //     code: number;
        //     message: string;
        //     status: string;
        // };
    }
    interface Route {
        routes: DistanceResponseProp[];
    }

    interface Error {
        error: {
            code: number;
            message: string;
            status: string;
        };
    }
    interface Data {
        paths: Props<Route | Error>[];
    }
    let response: ResponseProp = $props();

    onMount(() => {
        let timeline: Props<DistanceProp<number | null>>[] =
            response.data.paths.map((p) => {
                return {
                    ...p,
                    routes: p.routes.map((a) => {
                        if ("routes" in a) {
                            return {
                                distance: a.routes[0].distanceMeters,
                                duration: Number(
                                    a.routes[0].duration.replace("s", ""),
                                ),
                            };
                        } else {
                            return {
                                distance: null,
                                duration: null,
                            };
                        }
                    }),
                };
            });
        const ctx_line = document.getElementById("lineChart");
        const chartData: ChartData = toChartData(timeline);
        const chartOptions: ChartOptions = {
            scales: {
                yax: {
                    title: {
                        display: true,
                        text: "Perbezaan tempoh perjalanan (jam)",
                    },
                },
                xax: {
                    type: "time",
                    title: {
                        display: true,
                        text: "Masa bertolak",
                    },
                },
            },
        };
        let c = new Chart(ctx_line as ChartItem, {
            type: "line",
            data: chartData,
            options: chartOptions,
        });
    });
</script>

<svelte:head>
    <title>Time</title>
</svelte:head>

<!-- TODO: CSS styling -->
<section>
    <canvas id="lineChart"></canvas>
</section>
