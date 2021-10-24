import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Booking, IFetchedBooking } from '../../models/booking.model';
import { AuthService } from '../auth/auth.service';

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
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No user ID found!');
        }

        return this.httpClient.get<{ [key: string]: IFetchedBooking }>(
          `${environment.apiUrl}/bookings.json?orderBy="userId"&equalTo="${userId}"`
        );
      }),
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
    let newBooking: Booking;

    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No user ID found!');
        }

        newBooking = new Booking(
          Math.random().toString(),
          placeId,
          userId,
          placeTitle,
          placeImage,
          firstName,
          lastName,
          guestNumber,
          dateFrom,
          dateTo
        );
        return this.httpClient.post<{ name: string }>(
          `${environment.apiUrl}/bookings.json`,
          {
            ...newBooking,
            id: null,
          }
        );
      }),
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
