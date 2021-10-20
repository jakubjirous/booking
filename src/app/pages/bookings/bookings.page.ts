import { Component, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Booking } from '../../models/booking.model';
import { BookingsService } from '../../services/bookings/bookings.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  loadedBookings: Booking[];

  constructor(private bookingsService: BookingsService) {}

  ngOnInit(): void {
    this.loadedBookings = this.bookingsService.bookings;
  }

  onCancelBooking(bookingId: string, slidingEl: IonItemSliding): void {
    slidingEl.close();
    // cancel booking
  }
}
