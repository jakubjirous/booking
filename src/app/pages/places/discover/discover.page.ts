import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../../../services/places/places.service';
import { Place } from '../place.model';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  loadedPlaces: Place[];

  constructor(private placesService: PlacesService) {}

  ngOnInit() {
    this.loadedPlaces = this.placesService.places;
  }

  // ionViewWillEnter() {
  //   this.loadedPlaces = this.placesService.places;
  // }
}
