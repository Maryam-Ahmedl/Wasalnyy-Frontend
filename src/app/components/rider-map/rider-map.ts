import { Component,  OnInit } from '@angular/core';
import { Coordinates } from '../../models/trip-request.dto';
import { TripRequestService } from '../../services/trip-request.service';
import { FormsModule } from '@angular/forms';
import { PaymentMethod } from '../../enums/PaymentMethod';
import { RiderSideBar } from '../rider-sidebar/rider-sidebar';
import { MapComponent } from '../map-component/map-component';
import { TripInfoService } from '../../services/trip-info.service';
import { LocationResult } from '../../models/location-result';
import { TripComponent } from '../trip-component/trip-component';

@Component({
  selector: 'app-rider-map',
  imports: [FormsModule, RiderSideBar, MapComponent,TripComponent],
  templateUrl: './rider-map.html',
  styleUrls: ['./rider-map.css'],
})
export class RiderMap implements OnInit {

  currentCoords:Coordinates|null=null;
  destinationCoords:Coordinates|null=null;  
  paymentMethod: PaymentMethod | null = null;
  InTrip: boolean = false;
  activeTrip:any|null=null;
  driver:any|null=null;

  constructor(private tripRequestService: TripRequestService, private tripInfoService: TripInfoService) {}
ngOnInit(): void {
     this.tripInfoService.Intrip$.subscribe(Intrip => {
    this.InTrip = Intrip;
  });

  this.tripInfoService.trip$.subscribe(trip => {
     this.activeTrip = trip;
     this.currentCoords=trip.pickupCoordinates;
    this.destinationCoords=trip.distinationCoordinates;
  });
  this.tripInfoService.driver$.subscribe(driver=>{
    this.driver=driver;
  })
}
handleOriginUpdate(firstPointVal:LocationResult){
  this.currentCoords={Lat:Number(firstPointVal.lat),Lng:Number(firstPointVal.lon)};
  
 
}
handleDestinationUpdate(secondPointVal:LocationResult){
  this.destinationCoords={Lat:Number(secondPointVal.lat),Lng:Number(secondPointVal.lon)};
  
}
handlePaymenMethodUpdate(paymentMethodVal:number){
  this.paymentMethod=paymentMethodVal;
}
handleTripRequest(status:boolean){
  if(status){
    this.tripRequestService.requestTrip({PaymentMethod:this.paymentMethod!,
      PickupCoordinates:this.currentCoords!
      ,DistinationCoordinates:this.destinationCoords!}).subscribe();
  }
}
confirmTripRequest(tripId:any){
  this.tripRequestService.confirmTripRequest(tripId).subscribe({
next: (res) => {
    console.log('trip confirmed id :',tripId);
  },
  error: (err) => {
        console.error('Error:', err);
  }

  }

  );
}


}
