<script lang="ts">
    import { Chart } from "chart.js/auto";
    interface Coord {
        location: {
            latLng: {
                latitude: number;
                longitude: number;
            };
        };
    }
    interface DistanceResponseProp {
        distanceMeters: number;
        duration: string; // in seconds => `{duration}s`
    }
    interface DistanceProp<T> {
        distance: T; // in meters
        duration: T; // in seconds
    }
    interface RouteResponseProp {
        routes?: Array<DistanceResponseProp>;
        error?: {
            code: number;
            message: string;
            status: string;
        };
    }
    interface Props<R> {
        data: {
            routes: Array<R>;
            departures: Array<Date>;
            origin: Coord;
            destination: Coord;
        };
    }
    import { onMount } from "svelte";
    let response: Props<RouteResponseProp> = $props();
    let timeline: Props<DistanceProp<number | null>> = {
        data: { ...response.data, routes: [] },
    };
    timeline.data.routes = response.data.routes.map((a) =>
        a.routes
            ? {
                  distance: a.routes[0].distanceMeters,
                  duration: Number(a.routes[0].duration.replace("s", "")),
              }
            : { distance: null, duration: null },
    );

    onMount(() => {
        console.log(response);
        timeline.data.routes = response.data.routes.map((a) =>
            a.routes
                ? {
                      distance: a.routes[0].distanceMeters,
                      duration: Number(a.routes[0].duration.replace("s", "")),
                  }
                : { distance: null, duration: null },
        );
        console.log(timeline);
        const ctx = document.getElementById("lineChart");

        new Chart(ctx, {
            type: "line",
            data: {
                labels: timeline.data.departures.map(
                    (d) =>
                        `${d.getHours() < 10 ? "0" + d.getHours().toString() : d.getHours()}` +
                        `:${d.getMinutes() < 10 ? "0" + d.getMinutes().toString() : d.getMinutes()}`,
                ),
                datasets: [
                    {
                        // TODO: Get human readable name
                        label: [
                            timeline.data.origin.location.latLng.latitude.toFixed(
                                2,
                            ) +
                                "," +
                                timeline.data.origin.location.latLng.longitude.toFixed(
                                    2,
                                ) +
                                "-->" +
                                timeline.data.destination.location.latLng.latitude.toFixed(
                                    2,
                                ) +
                                "," +
                                timeline.data.destination.location.latLng.longitude.toFixed(
                                    2,
                                ),
                        ],
                        data: timeline.data.routes.map((r) =>
                            r.duration ? r.duration / 60 : r.duration,
                        ),
                    },
                ],
                options: {
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: "A",
                            },
                        },
                        x: {
                            title: {
                                text: "B",
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                },
            },
        });
    });
</script>

<svelte:head>
    <title>Map</title>
</svelte:head>

<!-- TODO: Chart -->
<section>
    <canvas id="lineChart"></canvas>
</section>
