import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, map, take, tap } from 'rxjs/operators';
import { Booking } from '../../models/booking.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  constructor(private authService: AuthService) {}

  private _bookings = new BehaviorSubject<Booking[]>([
    new Booking(
      'b1',
      'p1',
      'u1',
      'Manhattan Mansion',
      'https://cf.bstatic.com/xdata/images/hotel/max1280x900/256850958.jpg?k=be686463a73a7db2250f9bd8516156e5bf0faca52a0674d52674e761adf902ae&o=&hp=1',
      'James',
      'Jirous',
      2,
      new Date(),
      new Date()
    ),
    new Booking(
      'b2',
      'p2',
      'u2',
      'Stanley Park',
      'https://myldrwithafrenchman.files.wordpress.com/2017/01/eiffel_tower_in_paris__france_073036_.jpg?w=1118',
      'James',
      'Jirous',
      30,
      new Date(),
      new Date()
    ),
  ]);

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

    return this.bookings.pipe(
      take(1),
      delay(1500),
      tap((bookings) => {
        this._bookings.next(bookings.concat(newBooking));
      })
    );
  }

  cancelBooking(bookingId: string): Observable<Booking[]> {
    return this.bookings.pipe(
      take(1),
      delay(1500),
      tap((bookings) => {
        this._bookings.next(
          bookings.filter((booking) => booking?.id !== bookingId)
        );
      })
    );
  }
}
