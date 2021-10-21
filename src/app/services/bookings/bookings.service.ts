import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Booking } from '../../models/booking.model';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  constructor() {}

  private _bookings = new BehaviorSubject<Booking[]>([
    new Booking('b1', 'p1', 'u1', 'Manhattan Mansion', 15),
    new Booking('b2', 'p2', 'u2', 'Stanley Park', 30),
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
}
