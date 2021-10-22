import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { AnimationOptions } from 'ngx-lottie';
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
  isLoading: boolean = false;
  options: AnimationOptions = {
    path: '/assets/lotties/empty.json',
  };
  private loadedBookingsSubs: Subscription;

  constructor(
    private bookingsService: BookingsService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit(): void {
    this.loadedBookingsSubs = this.bookingsService.bookings.subscribe(
      (bookings) => {
        this.loadedBookings = bookings;
      }
    );
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.bookingsService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });
  }

  animationCreated(): void {}

  onCancelBooking(bookingId: string, slidingEl: IonItemSliding): void {
    slidingEl.close();
    this.loadingCtrl
      .create({
        message: 'Cancelling...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.bookingsService.cancelBooking(bookingId).subscribe(() => {
          loadingEl.dismiss();
        });
      });
  }

  ngOnDestroy(): void {
    if (this.loadedBookingsSubs) {
      this.loadedBookingsSubs.unsubscribe();
    }
  }
}
