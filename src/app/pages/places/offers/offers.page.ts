import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../../../models/place.model';
import { PlacesService } from '../../../services/places/places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  loadedOffers: Place[];
  isLoading: boolean;
  private loadedOffersSubs: Subscription;

  constructor(private placesService: PlacesService, private router: Router) {}

  ngOnInit(): void {
    this.loadedOffersSubs = this.placesService.places.subscribe((places) => {
      this.loadedOffers = places;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  onEdit(offerId: string, slidingEl: IonItemSliding): void {
    slidingEl.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
  }

  ngOnDestroy(): void {
    if (this.loadedOffersSubs) {
      this.loadedOffersSubs.unsubscribe();
    }
  }
}
