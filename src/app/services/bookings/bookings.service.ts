import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Booking, IFetchedBooking } from '../../models/booking.model';
import { AuthService } from '../auth/auth.service';

// new Booking(
//   'b1',
//   'p1',
//   'u1',
//   'Manhattan Mansion',
//   'https://cf.bstatic.com/xdata/images/hotel/max1280x900/256850958.jpg?k=be686463a73a7db2250f9bd8516156e5bf0faca52a0674d52674e761adf902ae&o=&hp=1',
//   'James',
//   'Jirous',
//   2,
//   new Date(),
//   new Date()
// ),
//   new Booking(
//     'b2',
//     'p2',
//     'u2',
//     'Stanley Park',
//     'https://myldrwithafrenchman.files.wordpress.com/2017/01/eiffel_tower_in_paris__france_073036_.jpg?w=1118',
//     'James',
//     'Jirous',
//     30,
//     new Date(),
//     new Date()
//   ),

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  private _bookings = new BehaviorSubject<Booking[]>([]);

  get bookings(): Observable<Booking[]> {
    return this._bookings.asObservable();
  }

  getBooking(bookingId: string): Observable<Booking> {
    return this.bookings.pipe(
      take(1),
      map((bookings) => {
        return {
          ...bookings.find((booking) => booking?.id === bookingId),
        };
      })
    );
  }

  fetchBookings(): Observable<Booking[]> {
    return this.httpClient
      .get<{ [key: string]: IFetchedBooking }>(
        `${environment.apiUrl}/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`
      )
      .pipe(
        map((response) => {
          if (!response) {
            throw throwError(response);
          }

          const bookings: Booking[] = [];
          for (const [bookingId, booking] of Object.entries(response)) {
            if (response.hasOwnProperty(bookingId)) {
              bookings.push(
                new Booking(
                  bookingId,
                  booking?.placeId,
                  booking?.userId,
                  booking?.placeTitle,
                  booking?.placeImage,
                  booking?.firstName,
                  booking?.lastName,
                  +booking?.guestNumber,
                  new Date(booking?.bookedFrom),
                  new Date(booking?.bookedTo)
                )
              );
            }
          }
          return bookings;
        }),
        tap((bookings) => {
          this._bookings.next(bookings);
        })
      );
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ): Observable<Booking[]> {
    let generatedId: string;

    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );

    return this.httpClient
      .post<{ name: string }>(`${environment.apiUrl}/bookings.json`, {
        ...newBooking,
        id: null,
      })
      .pipe(
        switchMap((response) => {
          if (!response) {
            throw throwError(response);
          }

          generatedId = response?.name;
          return this.bookings;
        }),
        take(1),
        tap((bookings) => {
          newBooking.id = generatedId;
          this._bookings.next(bookings.concat(newBooking));
        })
      );
  }

  cancelBooking(bookingId: string): Observable<Booking[]> {
    return this.httpClient
      .delete(`${environment.apiUrl}/bookings/${bookingId}.json`)
      .pipe(
        switchMap(() => {
          return this.bookings;
        }),
        take(1),
        tap((bookings) => {
          this._bookings.next(
            bookings.filter((booking) => booking?.id !== bookingId)
          );
        })
      );
  }
}
