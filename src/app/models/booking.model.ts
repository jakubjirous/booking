export class Booking {
  constructor(
    public id: string,
    public placeId: string,
    public userId: string,
    public placeTitle: string,
    public placeImage: string,
    public firstname: string,
    public lastName: string,
    public guestNumber: number,
    public bookedFrom: Date,
    public bookedTo: Date
  ) {}
}

export enum BookingMode {
  RANDOM = 'random',
  SELECT = 'select',
}
