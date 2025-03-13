export interface Coord {
  location: {
    latLng: {
      latitude: number;
      longitude: number;
    };
  };
}
export interface DistanceResponseProp {
  distanceMeters: number;
  duration: string; // in seconds => `{duration}s`
}
export interface DistanceProp<T> {
  distance: T; // in meters
  duration: T; // in seconds
}
export interface RouteResponseProp {
  routes?: Array<DistanceResponseProp>;
  error?: {
    code: number;
    message: string;
    status: string;
  };
}
export interface Props<R> {
  data: {
    routes: Array<R>;
    departures: Array<Date>;
    origin: Coord;
    destination: Coord;
  };
}
