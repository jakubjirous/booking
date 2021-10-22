import {
  AfterViewInit,
  Component,
  ElementRef, OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { ICoordinates } from '../../models/location.models';

@Component({
  selector: 'map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map') mapElementRef: ElementRef;
  clickListener: any;
  googleMaps: any;

  constructor(
    private modalCtrl: ModalController,
    private renderer: Renderer2
  ) {}

  ngOnInit() {}

  onCancel(): void {
    this.modalCtrl.dismiss(null, 'cancel', 'location-picker-modal');
  }

  // start initialization with google maps
  ngAfterViewInit(): void {
    this.getGoogleMaps()
      .then((googleMaps) => {
        // rendering a map
        this.googleMaps = googleMaps;
        const mapEl = this.mapElementRef.nativeElement;
        const map = new googleMaps.maps.Map(mapEl, {
          // vancouver
          center: {
            lat: 49.3126471303234,
            lng: -123.14295703901571,
          },
          zoom: 11,
        });
        this.googleMaps.maps.event.addListenerOnce(map, 'idle', () => {
          this.renderer.addClass(mapEl, 'visible');
        });

        // click on the map
        this.clickListener = map.addListener('click', (event) => {
          const selectedCoords: ICoordinates = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          };
          this.modalCtrl.dismiss(selectedCoords);
        });
      })
      .catch((error) => {
        // TODO: error handling (Jakub Jirous 2021-10-21 15:26:59)
        console.log(error);
      });
  }

  private getGoogleMaps(): Promise<any> {
    const win = window as any; // browser window
    const googleModule = win?.google;

    if (googleModule && googleModule?.maps) {
      return Promise.resolve(googleModule);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win?.google;
        if (loadedGoogleModule && loadedGoogleModule?.maps) {
          resolve(loadedGoogleModule);
        } else {
          reject('Google Maps SDK not available');
        }
      };
    });
  }

  ngOnDestroy(): void {
    this.googleMaps.maps.event.removeListener(this.clickListener);
  }
}
