import {
	GOOGLE_MAP_API_KEY,
	TEST_DESTINATION_COORDINATE,
	TEST_ORIGIN_COORDINATE,
} from "$env/static/private";

import { Coord as CoordInterface } from "./+page.svelte";

class Coord implements CoordInterface {
	location: { latLng: { latitude: number; longitude: number } };

	constructor(latitude: number, longitude: number) {
		this.location = {
			latLng: {
				latitude,
				longitude,
			},
		};
	}
}

export const load = async ({ fetch, cookies }) => {
	const today: Date = new Date();
	const times: Array<Date> = [...Array(24).keys()].map(
		(hr) =>
			new Date(
				Date.UTC(
					today.getUTCFullYear(),
					today.getUTCMonth(),
					// TODO: Find a way to get past timestamp
					// Can only get future timestamp
					today.getUTCDate() + 1,
					hr,
				),
			),
	);
	const coord_origin: Coord = new Coord(
		Number(TEST_ORIGIN_COORDINATE.split(",")[0]),
		Number(TEST_ORIGIN_COORDINATE.split(",")[1]),
	);
	const coord_dest: Coord = new Coord(
		Number(TEST_DESTINATION_COORDINATE.split(",")[0]),
		Number(TEST_DESTINATION_COORDINATE.split(",")[1]),
	);

	const requestRoute = (time: Date) =>
		fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-Api-Key": GOOGLE_MAP_API_KEY,
				"X-Goog-FieldMask":
					"routes.duration,routes.staticDuration,routes.distanceMeters",
				// TO INSPECT ALL FIELDS, USE *
				// 'X-Goog-FieldMask': '*'
			},
			body: JSON.stringify({
				origin: coord_origin,
				destination: coord_dest,
				travel_mode: "DRIVE",
				routingPreference: "TRAFFIC_AWARE",
				departure_time: time.toISOString(),
			}),
		});
	const res = await Promise.all(
		times.map(async (d) => await requestRoute(new Date())),
	);
	let item = await Promise.all(res.map(async (d) => (await d).json()));
	return {
		routes: item,
		departures: times,
		origin: JSON.parse(JSON.stringify(coord_origin)),
		destination: JSON.parse(JSON.stringify(coord_dest)),
	};
};
