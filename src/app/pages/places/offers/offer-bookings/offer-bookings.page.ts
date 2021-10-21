import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../../../../models/place.model';
import { PlacesService } from '../../../../services/places/places.service';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit, OnDestroy {
  place: Place;
  private placeSubs: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private placesService: PlacesService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap?.has('placeId')) {
        this.navController.navigateBack('/places/tabs/offers ');
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

  ngOnDestroy(): void {
    if (this.placeSubs) {
      this.placeSubs.unsubscribe();
    }
  }
}
