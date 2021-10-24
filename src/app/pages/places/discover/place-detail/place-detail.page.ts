import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { CreateBookingComponent } from '../../../../components/create-booking/create-booking.component';
import { BookingMode } from '../../../../models/booking.model';
import { Place } from '../../../../models/place.model';
import { AuthService } from '../../../../services/auth/auth.service';
import { BookingsService } from '../../../../services/bookings/bookings.service';
import { PlacesService } from '../../../../services/places/places.service';
import { MapModalComponent } from '../../../../shared/map-modal/map-modal.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  placeId: string;
  isBookable = false;
  isLoading: boolean = false;
  private placeSubs: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private bookingService: BookingsService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap?.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover ');
        return;
      }
      this.isLoading = true;
      this.placeId = paramMap?.get('placeId');
      let fetchedUserId: string;
      this.authService.userId
        .pipe(
          take(1),
          switchMap((userId) => {
            if (!userId) {
              throw new Error('No user ID found!');
            }
            fetchedUserId = userId;

            return this.placesService.getPlace(this.placeId);
          })
        )
        .subscribe(
          (place) => {
            this.isLoading = false;
            this.place = place;
            this.isBookable = place?.userId !== fetchedUserId;
          },
          (error) => {
            console.log(error);

            this.alertCtrl
              .create({
                header: 'An error occurred!',
                message:
                  'Could not load the place detail, please try again later.',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigateByUrl('/places/tabs/discover');
                    },
                  },
                ],
              })
              .then((alertEl) => {
                alertEl.present();
              });
          }
        );
    });
  }

  onBookPlace(): void {
    this.actionSheetCtrl
      .create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select Date',
            handler: () => {
              this.openBookingModal(BookingMode.SELECT);
            },
          },
          {
            text: 'Random Date',
            handler: () => {
              this.openBookingModal(BookingMode.RANDOM);
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }

  openBookingModal(mode: BookingMode): void {
    this.modalCtrl
      .create({
        id: 'create-booking-modal',
        component: CreateBookingComponent,
        componentProps: {
          selectedPlace: this.place,
          selectedMode: mode,
        },
      })
      .then((modelEl) => {
        modelEl.present();
        // add listener to sent data as modal result
        return modelEl.onDidDismiss();
      })
      .then((resultData) => {
        if (resultData?.role === 'confirm') {
          this.loadingCtrl
            .create({
              message: 'Booking place...',
            })
            .then((loadingEl) => {
              loadingEl.present();
              const bookingData = resultData?.data?.bookingData;
              this.bookingService
                .addBooking(
                  this.place?.id,
                  this.place?.title,
                  this.place?.imageUrl,
                  bookingData?.firstName,
                  bookingData?.lastName,
                  bookingData?.guestNumber,
                  bookingData?.startDate,
                  bookingData?.endDate
                )
                .subscribe(() => {
                  loadingEl.dismiss();
                  this.toastCtrl
                    .create({
                      message: 'Your booking was created.',
                      color: 'success',
                      duration: 3000,
                    })
                    .then((toastEl) => {
                      toastEl.present();
                    });
                });
            });
        }
      });
  }

  // show modal with full google map
  onShowFullMap(): void {
    this.modalCtrl
      .create({
        id: 'location-picker-modal',
        component: MapModalComponent,
        componentProps: {
          mapCenter: {
            lat: this.place?.location?.lat,
            lng: this.place?.location?.lng,
          },
          mapZoom: 11,
          mapMarkerTitle: 'Picked Location',
          title: this.place?.location?.address,
          closeButtonText: 'Close',
          selectable: false,
        },
      })
      .then((modalEl) => {
        modalEl.present();
      });
  }

  ngOnDestroy(): void {
    if (this.placeSubs) {
      this.placeSubs.unsubscribe();
    }
  }
}
