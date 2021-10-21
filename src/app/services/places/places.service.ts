import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IFetchedPlace, Place } from '../../models/place.model';
import { AuthService } from '../auth/auth.service';

// const dummyPlaces: Place[] = [
//   new Place(
//     'p1',
//     'Manhattan Mansion',
//     'In the heart of New York City.',
//     'https://images.unsplash.com/photo-1499566727020-881da110a0b0?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuaGF0dGFufGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80',
//     149.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'james'
//   ),
//   new Place(
//     'p2',
//     'Stanley Park',
//     'The biggest park in the Vancouver',
//     'https://vancouver.ca/images/cov/feature/stanley-park-seawall-landing.jpg',
//     256.44,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'james'
//   ),
//   new Place(
//     'p3',
//     "L'Amour Toujours",
//     'A romantic place in Paris!',
//     'https://myldrwithafrenchman.files.wordpress.com/2017/01/eiffel_tower_in_paris__france_073036_.jpg?w=1118',
//     167.87,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'james'
//   ),
//   new Place(
//     'p4',
//     'Opus Hotel',
//     'The most fancy hotel in the town',
//     'https://cf.bstatic.com/xdata/images/hotel/max1280x900/256850958.jpg?k=be686463a73a7db2250f9bd8516156e5bf0faca52a0674d52674e761adf902ae&o=&hp=1',
//     359.17,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'u4'
//   ),
// ];

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  private _places = new BehaviorSubject<Place[]>([]);

  get places(): Observable<Place[]> {
    return this._places.asObservable();
  }

  getPlace(placeId: string): Observable<Place> {
    return this.httpClient
      .get<IFetchedPlace>(
        `${environment.apiUrl}/offered-places/${placeId}.json`
      )
      .pipe(
        map((response) => {
          return new Place(
            placeId,
            response?.title,
            response?.description,
            response?.imageUrl,
            response?.price,
            new Date(response?.availableFrom),
            new Date(response?.availableTo),
            response?.userId
          );
        })
      );
  }

  fetchPlaces(): Observable<any> {
    return this.httpClient
      .get<{ [key: string]: IFetchedPlace }>(
        `${environment.apiUrl}/offered-places.json`
      )
      .pipe(
        map((response) => {
          const places: Place[] = [];
          for (const [placeId, place] of Object.entries(response)) {
            if (response.hasOwnProperty(placeId)) {
              places.push(
                new Place(
                  placeId,
                  place?.title,
                  place?.description,
                  place?.imageUrl,
                  place?.price,
                  new Date(place?.availableFrom),
                  new Date(place?.availableTo),
                  place?.userId
                )
              );
            }
          }
          return places;
        }),
        tap((places) => {
          this._places.next(places);
        })
      );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    availableFrom: Date,
    availableTo: Date
  ): Observable<Place[]> {
    let generatedId: string;

    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://media.istockphoto.com/photos/new-york-city-nyc-usa-picture-id615398376?b=1&k=20&m=615398376&s=170667a&w=0&h=v59Pfuvn4jTqysv0RYKsYhoUM_ayitgQIsG8cFg3rM8=',
      price,
      availableFrom,
      availableTo,
      this.authService.userId
    );

    return this.httpClient
      .post<{ name: string }>(`${environment.apiUrl}/offered-places.json`, {
        ...newPlace,
        id: null,
      })
      .pipe(
        switchMap((response) => {
          generatedId = response?.name;
          return this.places;
        }),
        take(1),
        tap((places) => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
  }

  updatePlace(
    placeId: string,
    title: string,
    description: string
  ): Observable<Place[]> {
    let updatedPlaces: Place[];

    return this.places.pipe(
      take(1),
      switchMap((places) => {
        if (!places || places?.length <= 0) {
          this.fetchPlaces();
        } else {
          // wraps object|array|... into Observable and emitting the value
          return of(places);
        }
      }),
      switchMap((places) => {
        const updatedPlaceIndex = places.findIndex(
          (place) => place?.id === placeId
        );
        updatedPlaces = [...places];
        const prevPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          prevPlace.id,
          title,
          description,
          prevPlace.imageUrl,
          prevPlace.price,
          prevPlace.availableFrom,
          prevPlace.availableTo,
          prevPlace.userId
        );

        return this.httpClient.put(
          `${environment.apiUrl}/offered-places/${placeId}.json`,
          {
            ...updatedPlaces[updatedPlaceIndex],
            id: null,
          }
        );
      }),
      tap<Place[]>(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}
