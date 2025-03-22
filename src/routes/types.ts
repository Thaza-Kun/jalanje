export interface Coord {
  location: {
    latLng: {
      latitude: number;
      longitude: number;
    };
  };
}
export interface NamedCoord {
  name: string;
  coord: Coord;
}
export interface DistanceResponseProp {
  distanceMeters: number;
  duration: string; // in seconds => `{duration}s`
}
export interface DistanceProp<T> {
  distance: T; // in meters
  duration: T; // in seconds
}
// export interface RouteResponseProp {
//   routes?: Array<DistanceResponseProp>;
// }
export interface Props<R> {
  routes: Array<R>;
  departures: Array<Date>;
  origin: NamedCoord;
  destination: NamedCoord;
}
