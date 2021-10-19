import { TestBed } from '@angular/core/testing';

import { BookingsService } from './bookings.service';

describe('BookingService', () => {
  let service: BookingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
