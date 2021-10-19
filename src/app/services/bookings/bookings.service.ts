import { Injectable } from '@angular/core';
import { Booking } from '../../models/booking.model';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  private _bookings: Booking[] = [
    new Booking('b1', 'p1', 'u1', 'Manhattan Mansion', 15),
    new Booking('b2', 'p2', 'u2', 'Stanley Park', 30),
  ];

  constructor() {}

  get bookings(): Booking[] {
    return [...this._bookings];
  }

  getBooking(bookingId: string): Booking {
    return {
      ...this._bookings.find((booking) => booking?.id === bookingId),
    };
  }
}
