export interface ShuttleData {
  device_id: string;
  lat: number;
  lng: number;
  speed: number;
  updated: string;
}

export interface Stop {
  id: string;
  name: string;
  lat: number;
  lng: number;
}
