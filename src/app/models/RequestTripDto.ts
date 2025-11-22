import { PaymentMethod } from "../enums/PaymentMethod";

export interface TripRequestDto {
  PaymentMethod: PaymentMethod;
  PickupCoordinates: {
    Lat: number;
    Lng: number;
  };
  DistinationCoordinates: {
    Lat: number;
    Lng: number;
  };
}
