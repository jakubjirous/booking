import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../../../../models/place.model';
import { PlacesService } from '../../../../services/places/places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  placeId: string;
  form: FormGroup;
  isLoading: boolean = false;
  private placeSubs: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private placesService: PlacesService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap?.has('placeId')) {
        this.navController.navigateBack('/places/tabs/offers');
        return;
      }
      this.isLoading = true;
      this.placeId = paramMap?.get('placeId');
      this.placeSubs = this.placesService.getPlace(this.placeId).subscribe(
        (place) => {
          this.place = place;
          this.formFactory();
          this.isLoading = false;
        },
        () => {
          this.alertCtrl
            .create({
              header: 'An error occurred!',
              message: 'Place could not be fetched, please try again later.',
              buttons: [
                {
                  text: 'Okay',
                  handler: () => {
                    this.router.navigateByUrl('/places/tabs/offers');
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

  onUpdateOffer(): void {
    if (!this.form?.valid) {
      return;
    }

    this.loadingCtrl
      .create({
        message: 'Updating place...',
      })
      .then((loadingEl) => {
        loadingEl.present();

        this.placesService
          .updatePlace(
            this.place.id,
            this.form.value.title,
            this.form.value.description
          )
          .subscribe(() => {
            this.loadingCtrl.dismiss();
            this.form.reset();
            this.router.navigateByUrl('/places/tabs/offers');
          });
      });
  }

  ngOnDestroy(): void {
    if (this.placeSubs) {
      this.placeSubs.unsubscribe();
    }
  }

  private formFactory(): void {
    this.form = new FormGroup({
      title: new FormControl(this.place?.title, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      description: new FormControl(this.place?.description, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      // price: new FormControl(null, {
      //   updateOn: 'blur',
      //   validators: [Validators.required, Validators.min(1)],
      // }),
      // dateFrom: new FormControl(null, {
      //   updateOn: 'blur',
      //   validators: [Validators.required],
      // }),
      // dateTo: new FormControl(null, {
      //   updateOn: 'blur',
      //   validators: [Validators.required],
      // }),
    });
  }
}
