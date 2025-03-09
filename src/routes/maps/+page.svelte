<svelte:head>
  <title>Map</title>
</svelte:head>

<script lang="ts">
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
	staticDuration: string; // in seconds => `{duration}s`
}
interface DistanceProp<T> {
	distance: T; // in meters
	duration: T; // in seconds
	staticDuration: T; // in seconds
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
let response : Props<RouteResponseProp> = $props();

let timeline: Props<DistanceProp<number | null>> = {
	data: { ...response.data, routes: [] },
};
timeline.data.routes = response.data.routes.map((a) =>
	a.routes
		? {
				distance: a.routes[0].distanceMeters,
				duration: Number(a.routes[0].duration.replace("s", "")),
				staticDuration: Number(a.routes[0].staticDuration.replace("s", "")),
			}
		: { distance: null, duration: null, staticDuration: null },
);

onMount(() => {
	console.log(timeline);
});
</script>

<!-- TODO: Chart -->
<section>
  {timeline.data.routes.map(
			(r) => `${r.distance}m (${r.duration}s / ${r.staticDuration}s)`
		)}
</section>