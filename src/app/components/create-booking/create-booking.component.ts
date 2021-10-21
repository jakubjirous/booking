import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BookingMode } from '../../models/booking.model';
import { Place } from '../../models/place.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: BookingMode;
  @ViewChild('form', { static: true }) form: NgForm;

  startDate: string;
  endDate: string;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit(): void {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);

    if (this.selectedMode === BookingMode.RANDOM) {
      const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
      this.startDate = new Date(
        availableFrom.getTime() +
          Math.random() *
            (availableTo.getTime() - oneWeekInMs - availableFrom.getTime())
      ).toISOString();

      const sixDays = 6 * 24 * 60 * 60 * 1000;
      this.endDate = new Date(
        new Date(this.startDate).getTime() +
          Math.random() *
            (new Date(this.startDate).getTime() +
              sixDays -
              new Date(this.startDate).getTime())
      ).toISOString();
    } else {
    }
  }

  onCancel(): void {
    this.modalCtrl.dismiss(null, 'cancel', 'create-booking-modal');
  }

  datesValid(): boolean {
    const startDate = new Date(this.form.value['dateFrom']);
    const endDate = new Date(this.form.value['dateTo']);
    return endDate > startDate;
  }

  onBookPlace(): void {
    if (!this.form.valid || !this.datesValid()) {
      return;
    }

    this.modalCtrl.dismiss(
      {
        bookingData: {
          firstName: this.form.value['firstName'],
          lastName: this.form.value['lastName'],
          guestNumber: this.form.value['guestNumber'],
          startDate: this.form.value['dateFrom'],
          endDate: this.form.value['dateTo'],
        },
      },
      'confirm',
      'create-booking-modal'
    );
  }
}
