import { Component, Input, OnInit } from '@angular/core';
import { Place } from '../../models/place.model';

@Component({
  selector: 'offer-item',
  templateUrl: './offer-item.component.html',
  styleUrls: ['./offer-item.component.scss'],
})
export class OfferItemComponent implements OnInit {
  @Input() offer: Place;

  constructor() {}

  ngOnInit(): void {}

  getDummyDate(): Date {
    return new Date();
  }
}
