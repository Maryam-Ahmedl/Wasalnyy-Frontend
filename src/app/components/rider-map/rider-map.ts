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
import { MessageBox } from '../message-box/message-box';

@Component({
  selector: 'app-rider-map',
  imports: [FormsModule, RiderSideBar, MapComponent,TripComponent,MessageBox],
  templateUrl: './rider-map.html',
  styleUrls: ['./rider-map.css'],
})
export class RiderMap implements OnInit {
  pickupCoords:Coordinates|null=null;
  currentCoords:Coordinates|null=null;
  destinationCoords:Coordinates|null=null;  
  paymentMethod: PaymentMethod | null = null;
  InTrip: boolean = false;
  tripStatus:string|null=null;
  activeTrip:any|null=null;
  driver:any|null=null;
  errorState:boolean=false;
  errorMessage:string|null=null;

  constructor(private tripRequestService: TripRequestService, private tripInfoService: TripInfoService) {}
ngOnInit(): void {
     this.tripInfoService.Intrip$.subscribe(Intrip => {
    this.InTrip = Intrip;
  });

  this.tripInfoService.trip$.subscribe(trip => {
   
     if(trip){
        this.activeTrip = {...trip};
        this.currentCoords={...trip.CurrentCoordinates};
       this.pickupCoords={...trip.pickupCoordinates};
      this.destinationCoords={...trip.distinationCoordinates};
    this.tripStatus=trip.tripStatus; 
  }else {
    this.activeTrip = null;
    this.tripStatus = null;
    this.currentCoords = null;
    this.pickupCoords = null;
    this.destinationCoords = null;
    }
  });
  this.tripInfoService.driver$.subscribe(driver=>{
    this.driver=driver;
  })
}
handleOriginUpdate(firstPointVal:LocationResult){
  this.currentCoords={Lat:Number(firstPointVal.lat),Lng:Number(firstPointVal.lon),locationName:firstPointVal.display_name};
  
 
}
handleDestinationUpdate(secondPointVal:LocationResult){
  this.destinationCoords={Lat:Number(secondPointVal.lat),Lng:Number(secondPointVal.lon),locationName:secondPointVal.display_name};
  
}
handlePaymenMethodUpdate(paymentMethodVal:number){
  this.paymentMethod=paymentMethodVal;
}
handleTripRequest(status:boolean){
  if(status){
    this.tripRequestService.requestTrip({PaymentMethod:this.paymentMethod!,
      PickupCoordinates:this.currentCoords!
      ,DistinationCoordinates:this.destinationCoords!}).subscribe(
        {
          next:res=>{
            this.InTrip=true;
            this.tripStatus="Requested";
          },error:err=>{
            this.errorState=true;
            this.errorMessage=err.error.message;
          }
        }
      );
  }
}
confirmTripRequest(tripId:any){
  this.tripRequestService.confirmTripRequest(tripId).subscribe({
next: (res) => {
     this.tripStatus="Confirmed";
  },
  error: (err) => {
        console.error('Error:', err);
        this.errorState=true;
        this.errorMessage=err.error.message;
  }

  }

  );
}
cancelTrip(tripId:any){
  this.tripRequestService.CancelTrip(tripId).subscribe({
    next:(res)=>{},error:(err)=>{
      console.error('Error:',err);
      this.errorState=true;
      this.errorMessage=err.error.Value.Message;
    }
  })
}

getFirstPoint() {
  if (!this.InTrip)  {
    return  this.currentCoords;
  }
  switch(this.tripStatus) {
    case "Requested":
    case "Confirmed":
      return this.pickupCoords ?? null;
    case "Accepted":
      case "Started":
      return this.currentCoords ?? null;
    default:
      return null;
  }
}

getSecondPoint() {
  if (!this.InTrip){
    return this.destinationCoords;
  }

  switch(this.tripStatus) {
    case "Requested":
    case "Confirmed":
     case "Started":
    return this.destinationCoords ?? null;
    case "Accepted":
    return this.pickupCoords;
    default:
      return null;
  }
}
acknowledgeError(){
  this.errorState=false;
  this.errorMessage=null;
}


}
