import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { IPlaceLocation } from '../../../../models/location.models';
import { PlacesService } from '../../../../services/places/places.service';
import { UtilsService } from '../../../../services/utils/utils.service';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private utilsService: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.formFactory();
  }

  onCreateOffer(): void {
    if (!this.form?.valid || !this.form?.get('image')?.value) {
      return;
    }

    this.loadingCtrl
      .create({
        message: 'Creating place...',
      })
      .then((loadingEl) => {
        loadingEl.present();

        this.placesService
          .addPlace(
            this.form.value.title,
            this.form.value.description,
            +this.form.value.price,
            new Date(this.form.value.dateFrom),
            new Date(this.form.value.dateTo),
            this.form.value.location
          )
          .subscribe(() => {
            this.loadingCtrl.dismiss();
            this.form.reset();
            this.router.navigateByUrl('/places/tabs/offers');
          });
      });
  }

  onLocationPicked(location: IPlaceLocation) {
    // updating out internal form object to hold that location
    this.form?.patchValue({
      location: location,
    });
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      // conversion to file
      try {
        imageFile = this.utilsService.base64toBlob(imageData.replace('data:image/jpeg;base64,', ''), 'image/jpeg');
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData
    }

    this.form?.patchValue({ image: imageFile });
  }

  private formFactory(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)],
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      location: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      image: new FormControl(null, {
        updateOn: 'blur',
      }),
    });
  }
}
