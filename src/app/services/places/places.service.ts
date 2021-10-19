import { Injectable } from '@angular/core';
import { Place } from '../../pages/places/place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  constructor() {
  }

  private _places: Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City.',
      'https://images.unsplash.com/photo-1499566727020-881da110a0b0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuaGF0dGFufGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80',
      149.99
    ),
    new Place(
      'p2',
      'Stanley Park',
      'The biggest park in the Vancouver',
      'https://vancouver.ca/images/cov/feature/stanley-park-seawall-landing.jpg',
      256.44
    ),
    new Place(
      'p3',
      "L'Amour Toujours",
      'A romantic place in Paris!',
      'https://myldrwithafrenchman.files.wordpress.com/2017/01/eiffel_tower_in_paris__france_073036_.jpg?w=1118',
      167.87
    ),
    new Place(
      'p4',
      'Opus Hotel',
      'The most fancy hotel in the town',
      'https://cf.bstatic.com/xdata/images/hotel/max1280x900/256850958.jpg?k=be686463a73a7db2250f9bd8516156e5bf0faca52a0674d52674e761adf902ae&o=&hp=1',
      359.17
    ),
  ];

  get places(): Place[] {
    return [...this._places];
  }

  getPlace(placeId: string): Place {
    return {
      ...this._places.find(place => place?.id === placeId)
    }
  }
}
