import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IPlaceLocation } from '../../models/location.models';
import { IFetchedImage, IFetchedPlace, Place } from '../../models/place.model';
import { AuthService } from '../auth/auth.service';

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

  uploadImage(image: File): Observable<IFetchedImage> {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.httpClient.post<IFetchedImage>(
      `${environment.firebase.cloudFunctions}/storeImage`,
      uploadData
    );
  }

  getPlace(placeId: string): Observable<Place> {
    return this.httpClient
      .get<IFetchedPlace>(
        `${environment.apiUrl}/offered-places/${placeId}.json`
      )
      .pipe(
        map((response) => {
          if (!response) {
            throw throwError(response);
          }

          return new Place(
            placeId,
            response?.title,
            response?.description,
            response?.imageUrl,
            response?.price,
            new Date(response?.availableFrom),
            new Date(response?.availableTo),
            response?.userId,
            response?.location
          );
        })
      );
  }

  fetchPlaces(): Observable<Place[]> {
    return this.httpClient
      .get<{ [key: string]: IFetchedPlace }>(
        `${environment.apiUrl}/offered-places.json`
      )
      .pipe(
        map((response) => {
          if (!response) {
            throw throwError(response);
          }

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
                  place?.userId,
                  place?.location
                )
              );
            }
          }
          return places;
          // return [];
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
    availableTo: Date,
    location: IPlaceLocation,
    imageUrl: string
  ): Observable<Place[]> {
    let generatedId: string;
    let newPlace: Place;

    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No user ID found!');
        }

        newPlace = new Place(
          Math.random().toString(),
          title,
          description,
          imageUrl,
          price,
          availableFrom,
          availableTo,
          userId,
          location
        );

        return this.httpClient.post<{ name: string }>(
          `${environment.apiUrl}/offered-places.json`,
          {
            ...newPlace,
            id: null,
          }
        );
      }),
      switchMap((response) => {
        if (!response) {
          throw throwError(response);
        }

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
          prevPlace.userId,
          prevPlace.location
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
