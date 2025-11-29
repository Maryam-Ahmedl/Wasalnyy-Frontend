export interface TripRequestDto {
  PaymentMethod: number;
  PickupCoordinates: Coordinates;
  DistinationCoordinates: Coordinates;
  // PickUpName:String;
  // DestinationName:String;
    // Typo matches backend
}

export interface Coordinates {
  Lat: number;
  Lng: number;
  locationName?:string;
}