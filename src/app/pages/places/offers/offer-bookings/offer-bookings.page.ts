import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from "@ionic/angular";
import { PlacesService } from "../../../../services/places/places.service";
import { Place } from '../../place.model';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit {
  place: Place;

  constructor(private activatedRoute: ActivatedRoute, private navController: NavController, private placesService: PlacesService) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap?.has('placeId')) {
        this.navController.navigateBack('/places/tabs/offers ');
        return;
      }

      const placeId = paramMap?.get('placeId');
      this.place = this.placesService.getPlace(placeId);
    });
  }
}
