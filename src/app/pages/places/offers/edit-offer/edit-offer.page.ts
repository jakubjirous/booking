import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PlacesService } from '../../../../services/places/places.service';
import { Place } from '../../../../models/place.model';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  place: Place;
  form: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private placesService: PlacesService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap?.has('placeId')) {
        this.navController.navigateBack('/places/tabs/offers ');
        return;
      }

      const placeId = paramMap?.get('placeId');
      this.place = this.placesService.getPlace(placeId);

      this.formFactory();
    });
  }

  onUpdateOffer(): void {
    if (!this.form.valid) {
      return;
    }

    console.log('onEditOffer');
    console.log(this.form);
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
