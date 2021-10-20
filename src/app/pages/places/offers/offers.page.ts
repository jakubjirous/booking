import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { PlacesService } from '../../../services/places/places.service';
import { Place } from '../../../models/place.model';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  loadedPlaces: Place[];

  constructor(private placesService: PlacesService, private router: Router) {}

  ngOnInit(): void {
    this.loadedPlaces = this.placesService.places;
  }

  onEdit(offerId: string, slidingEl: IonItemSliding): void {
    slidingEl.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
  }
}
