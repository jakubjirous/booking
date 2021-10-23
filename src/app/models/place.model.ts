import { IPlaceLocation } from './location.models';

export class Place {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imageUrl: string,
    public price: number,
    public availableFrom: Date,
    public availableTo: Date,
    public userId: string,
    public location: IPlaceLocation
  ) {}
}

export interface IFetchedPlace {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  availableFrom: string;
  availableTo: string;
  userId: string;
  location: IPlaceLocation;
}

export interface IFetchedImage {
  imageUrl: string;
  imagePath: string;
}
