import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { CreateBookingComponent } from '../../../../components/create-booking/create-booking.component';
import { PlacesService } from '../../../../services/places/places.service';
import { Place } from '../../../../models/place.model';

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
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap?.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover ');
        return;
      }

      const placeId = paramMap?.get('placeId');
      this.place = this.placesService.getPlace(placeId);
    });
  }

  onBookPlace() {
    // this.router.navigateByUrl('/places/tabs/discover');
    // this.navCtrl.navigateBack('/places/tabs/discover');

    // you need previous page in stack
    // this.navCtrl.pop();

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
