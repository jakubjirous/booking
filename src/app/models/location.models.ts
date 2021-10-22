export interface ICoordinates {
  lat: number;
  lng: number;
}

export interface IPlaceLocation extends ICoordinates {
  address: string;
  staticMapImageUrl: string;
}
