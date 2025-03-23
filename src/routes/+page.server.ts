import {
  GOOGLE_MAP_API_KEY,
  TEST_DESTINATION_COORDINATE,
  TEST_ORIGIN_COORDINATE,
} from "$env/static/private";
import { get } from "svelte/store";

import type {
  Coord as CoordInterface,
  NamedCoord as NamedCoordInterface,
} from "./types.ts";

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

class NamedCoord implements NamedCoordInterface {
  name: string;
  coord: Coord;

  constructor(name: string, coord: Coord) {
    (this.name = name), (this.coord = coord);
  }
}

export const load = async ({ fetch, cookies }) => {
  const today: Date = new Date();
  const times: Array<Date> = [...Array(24).keys()].map(
    // + 30_000 => offset time to 30 seconds from request
    (hr) => new Date(today.getTime() + 1 * hr * 60 * 60 * 1000 + 30_000),
  );
  const coord_KLCC_KL: NamedCoord = new NamedCoord(
    "KLCC, KL",
    new Coord(3.1574851, 101.7108034),
  );
  const coord_Ipoh_Perak: NamedCoord = new NamedCoord(
    "Ipoh, Perak",
    new Coord(4.6099483, 101.0092068),
  );
  const coord_JohorBahru_Johor: NamedCoord = new NamedCoord(
    "Johor Bahru, Johor",
    new Coord(1.5417646, 103.6794114),
  );
  const coord_Melaka_Melaka: NamedCoord = new NamedCoord(
    "Melaka, Melaka",
    new Coord(2.227591, 102.1544289),
  );
  const coord_Seremban_NS: NamedCoord = new NamedCoord(
    "Seremban, N. Sembilan",
    new Coord(2.7121497, 101.8895928),
  );
  const coord_ShahAlam_Selangor: NamedCoord = new NamedCoord(
    "Shah Alam, Selangor",
    new Coord(3.1029376, 101.5003528),
  );
  const coord_Kuantan_Pahang: NamedCoord = new NamedCoord(
    "Kuantan, Pahang",
    new Coord(3.8085613, 103.0994929),
  );
  const coord_KotaBahru_Kelantan: NamedCoord = new NamedCoord(
    "Kota Bahru, Kelantan",
    new Coord(6.1071662, 102.2173466),
  );
  const coord_Georgetown_PPinang: NamedCoord = new NamedCoord(
    "Georgetown, P. Pinang",
    new Coord(5.4058785, 100.2681469),
  );
  const coord_AlorSetar_Kedah: NamedCoord = new NamedCoord(
    "Alor Setar, Kedah",
    new Coord(5.9906677, 100.4951372),
  );
  const coord_Kangar_Perlis: NamedCoord = new NamedCoord(
    "Kangar, Perlis",
    new Coord(6.4908352, 100.1700121),
  );
  const coord_KualaTerengganu_Terengganu: NamedCoord = new NamedCoord(
    "Kuala Terengganu, Terengganu",
    new Coord(5.4838247, 102.698349),
  );

  const requestRoute = (time: Date, origin: Coord, destination: Coord) =>
    fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAP_API_KEY,
        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters",
        // TO INSPECT ALL FIELDS, USE *
        // 'X-Goog-FieldMask': '*'
      },
      body: JSON.stringify({
        origin: origin,
        destination: destination,
        travel_mode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        departure_time: time.toISOString(),
        regionCode: "my",
      }),
    });
  const pairs = [
    [coord_Kangar_Perlis, coord_KLCC_KL],
    [coord_JohorBahru_Johor, coord_KLCC_KL],
    [coord_KotaBahru_Kelantan, coord_KLCC_KL],
    [coord_Ipoh_Perak, coord_KLCC_KL],
    [coord_Seremban_NS, coord_KLCC_KL],
    [coord_Melaka_Melaka, coord_KLCC_KL],
    [coord_Kuantan_Pahang, coord_KLCC_KL],
    [coord_AlorSetar_Kedah, coord_KLCC_KL],
  ];
  const getData = async (origin: Coord, destination: Coord) => {
    const res = await Promise.all(
      times.map(async (d) => await requestRoute(d, origin, destination)),
    );
    return await Promise.all(res.map(async (d) => (await d).json()));
  };
  return {
    paths: await Promise.all(
      pairs.map(async (location) => {
        return {
          routes: await getData(location[0].coord, location[1].coord),
          departures: times,
          origin: JSON.parse(JSON.stringify(location[0])),
          destination: JSON.parse(JSON.stringify(location[1])),
        };
      }),
    ),
  };
};
