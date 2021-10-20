import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ActionSheetController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { CreateBookingComponent } from '../../../../components/create-booking/create-booking.component';
import { Place } from '../../../../models/place.model';
import { PlacesService } from '../../../../services/places/places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: Place;

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
      this.place = this.placesService.getPlace(placeId);
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
              this.openBookingModal('select');
            },
          },
          {
            text: 'Random Date',
            handler: () => {
              this.openBookingModal('random');
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

  openBookingModal(mode: 'select' | 'random'): void {
    // TODO: pass mode as modal props (Jakub Jirous 2021-10-19 14:03:33)
    console.log(mode);

    // open modal here
    this.modalCtrl
      .create({
        id: 'create-booking-modal',
        component: CreateBookingComponent,
        componentProps: {
          selectedPlace: this.place,
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
}
