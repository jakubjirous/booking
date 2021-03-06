import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AnimationOptions } from 'ngx-lottie';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Place } from '../../../models/place.model';
import { AuthService } from '../../../services/auth/auth.service';
import { PlacesService } from '../../../services/places/places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  relevantPlaces: Place[];
  isLoading: boolean;
  isAllPlaces: boolean = true;
  options: AnimationOptions = {
    path: '/assets/lotties/place.json',
  };
  private loadedPlacesSubs: Subscription;

  constructor(
    private placesService: PlacesService,
    private menuCtrl: MenuController,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadedPlacesSubs = this.placesService.places.subscribe((places) => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(
      () => {
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onOpenMenu(): void {
    this.menuCtrl.toggle('menu1');
  }

  onFilterUpdate(event: Event): void {
    this.authService.userId.pipe(take(1)).subscribe((userId) => {
      if ((event as CustomEvent<SegmentChangeEventDetail>)?.detail?.value === 'all') {
        this.isAllPlaces = true;
        this.relevantPlaces = this.loadedPlaces;
        this.listedLoadedPlaces = this.relevantPlaces.slice(1);
      } else {
        this.isAllPlaces = false;
        this.relevantPlaces = this.loadedPlaces.filter(
          (place) => place?.userId !== userId
        );
        this.listedLoadedPlaces = this.relevantPlaces.slice(1);
      }
    });
  }

  animationCreated(): void {}

  ngOnDestroy(): void {
    if (this.loadedPlacesSubs) {
      this.loadedPlacesSubs.unsubscribe();
    }
  }
}
