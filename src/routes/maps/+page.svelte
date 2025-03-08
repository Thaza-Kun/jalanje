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
interface DistanceProp {
	distanceMeters: number;
	duration: string; // in seconds => `{duration}s`
	staticDuration: string; // in seconds => `{duration}s`
}
interface RouteProp {
	routes: Array<DistanceProp>;
}
interface Props {
	data: {
		routes: Array<RouteProp>;
		departures: Array<Date>;
		origin: Coord;
		destination: Coord;
	};
}
import { onMount } from "svelte";
let { data }: Props = $props();
</script>

<!-- TODO: Chart -->
<section>
  {data.routes.map((a) => a.routes.map(r => `${r.distanceMeters}m (${Number(r.duration.replace("s", ""))} / ${Number(r.staticDuration.replace("s", ""))})`))}
</section>