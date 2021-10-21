import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Booking } from '../../models/booking.model';
import { BookingsService } from '../../services/bookings/bookings.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  private loadedBookingsSubs: Subscription;

  constructor(private bookingsService: BookingsService) {}

  ngOnInit(): void {
    this.loadedBookingsSubs = this.bookingsService.bookings.subscribe(
      (bookings) => {
        this.loadedBookings = bookings;
      }
    );
  }

  onCancelBooking(bookingId: string, slidingEl: IonItemSliding): void {
    slidingEl.close();
    // cancel booking
  }

  ngOnDestroy(): void {
    if (this.loadedBookingsSubs) {
      this.loadedBookingsSubs.unsubscribe();
    }
  }
}
