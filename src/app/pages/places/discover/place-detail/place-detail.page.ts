import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ActionSheetController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CreateBookingComponent } from '../../../../components/create-booking/create-booking.component';
import { BookingMode } from '../../../../models/booking.model';
import { Place } from '../../../../models/place.model';
import { PlacesService } from '../../../../services/places/places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  private placeSubs: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap?.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover ');
        return;
      }

      const placeId = paramMap?.get('placeId');
      this.placeSubs = this.placesService
        .getPlace(placeId)
        .subscribe((place) => {
          this.place = place;
        });
    });
  }

  onBookPlace(): void {
    // this.router.navigateByUrl('/places/tabs/discover');
    // this.navCtrl.navigateBack('/places/tabs/discover');

    // you need previous page in stack
    // this.navCtrl.pop();

    // new action sheet
    this.actionSheetCtrl
      .create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select Date',
            handler: () => {
              this.openBookingModal(BookingMode.SELECT);
            },
          },
          {
            text: 'Random Date',
            handler: () => {
              this.openBookingModal(BookingMode.RANDOM);
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }

  openBookingModal(mode: BookingMode): void {
    this.modalCtrl
      .create({
        id: 'create-booking-modal',
        component: CreateBookingComponent,
        componentProps: {
          selectedPlace: this.place,
          selectedMode: mode,
        },
      })
      .then((modelEl) => {
        modelEl.present();
        // add listener to sent data as modal result
        return modelEl.onDidDismiss();
      })
      .then((resultData) => {
        console.log(resultData);

        if (resultData?.role === 'confirm') {
          console.log('BOOKED');
        }
      });
  }

  ngOnDestroy(): void {
    if (this.placeSubs) {
      this.placeSubs.unsubscribe();
    }
  }
}
