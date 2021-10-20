import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Place } from '../../../models/place.model';
import { PlacesService } from '../../../services/places/places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];

  constructor(
    private placesService: PlacesService,
    private menuCtrl: MenuController
  ) {}

  ngOnInit(): void {
    this.loadedPlaces = this.placesService.places;
    this.listedLoadedPlaces = this.loadedPlaces.slice(1);
  }

  onOpenMenu(): void {
    this.menuCtrl.toggle('menu1');
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>): void {
    console.log(event?.detail);
  }

  // ionViewWillEnter() {
  //   this.loadedPlaces = this.placesService.places;
  // }
}
