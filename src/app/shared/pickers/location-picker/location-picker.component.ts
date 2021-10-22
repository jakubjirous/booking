import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { IPlaceLocation } from '../../../models/location.models';
import { MapModalComponent } from '../../map-modal/map-modal.component';

@Component({
  selector: 'location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  @Output() locationPick = new EventEmitter<IPlaceLocation>();
  selectedLocationImage: string;
  isLoading: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private httpClient: HttpClient
  ) {}

  private getMapImage(
    lat: number,
    lng: number,
    zoom: number,
    markerColor: string = '0xd64939'
  ): string {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=600x337&maptype=roadmap&markers=color:${markerColor}%7Clabel:Place%7C${lat},${lng}&key=${environment.googleMapsApiKey}`;
  }

  ngOnInit() {}

  onPickLocation(): void {
    this.modalCtrl
      .create({
        id: 'location-picker-modal',
        component: MapModalComponent,
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          }
          const pickedLocation: IPlaceLocation = {
            lat: modalData.data?.lat,
            lng: modalData.data?.lng,
            address: null,
            staticMapImageUrl: null,
          };
          this.isLoading = true;
          this.getAddress(pickedLocation?.lat, pickedLocation?.lng)
            .pipe(
              switchMap((address) => {
                pickedLocation.address = address;
                return of(
                  this.getMapImage(pickedLocation?.lat, pickedLocation?.lng, 12)
                );
              })
            )
            .subscribe((staticMapImageUrl) => {
              this.isLoading = false;
              pickedLocation.staticMapImageUrl = staticMapImageUrl;
              this.selectedLocationImage = staticMapImageUrl;
              this.locationPick.emit(pickedLocation);
            });
        });
        modalEl.present();
      });
  }

  private getAddress(lat: number, lng: number): Observable<any> {
    return this.httpClient
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsApiKey}`
      )
      .pipe(
        map((geoData: any) => {
          if (!geoData || !geoData?.results || geoData?.results?.length === 0) {
            return null;
          }
          return geoData?.results?.[0]?.formatted_address;
        })
      );
  }
}
