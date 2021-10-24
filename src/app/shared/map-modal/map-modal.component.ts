import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
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

  @Input() mapCenter: ICoordinates = {
    lat: 49.3126471303234,
    lng: -123.14295703901571,
  };
  @Input() mapZoom: number = 11;
  @Input() mapMarkerTitle: string = 'Picked Location';
  @Input() title: string = 'Pick Location';
  @Input() closeButtonText: string = 'Cancel';
  @Input() selectable: boolean = true;

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
          center: this.mapCenter,
          zoom: this.mapZoom,
        });
        this.googleMaps.maps.event.addListenerOnce(map, 'idle', () => {
          this.renderer.addClass(mapEl, 'visible');
        });

        // pick a location after click on the map
        if (this.selectable) {
          this.clickListener = map.addListener('click', (event) => {
            const selectedCoords: ICoordinates = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
            };
            this.modalCtrl.dismiss(selectedCoords);
          });
        } else {
          // adding marker to the map on my center location
          const marker = new googleMaps.maps.Marker({
            position: this.mapCenter,
            map: map,
            title: this.mapMarkerTitle,
          });
          marker.setMap(map);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.googleMaps.maps.event.removeListener(this.clickListener);
    }
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
}
