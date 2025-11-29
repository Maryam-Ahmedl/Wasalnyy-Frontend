import { Component, OnDestroy, OnInit } from '@angular/core';
import { DriverHubService } from '../../services/driverHub.service';
import { FormsModule } from '@angular/forms';
import { TripInfoService } from '../../services/trip-info.service';
import { MapComponent } from '../map-component/map-component';
import { Coordinates } from '../../models/trip-request.dto';
import { Router } from '@angular/router';
import { TripComponent } from '../trip-component/trip-component';
import { MessageBox } from '../message-box/message-box';
@Component({
  selector: 'app-driver-map',
  imports: [FormsModule,MapComponent,TripComponent,MessageBox],
  templateUrl: './driver-map.html',
  styleUrl: './driver-map.css',
})
export class DriverMap implements OnInit, OnDestroy{

  currentCoords:Coordinates|null=null;
  pickupCoords:Coordinates|null=null;
  destinationCoords:Coordinates|null=null;
  tripId: string = "";
  available:boolean=false;
  intrip:boolean=false;
  tripStatus:string|null=null;
  activeTrip:any=null;
  availableTrips:any[]=[];
  errorState:boolean=false;
  errorMessage:string|null=null;

  constructor(private driverHubService: DriverHubService,private tripInfoService:TripInfoService,private router:Router) { }
ngOnInit(): void {
  this.tripInfoService.Intrip$.subscribe(intrip=>{
    this.intrip=intrip;
    this.available=intrip;
 })
  this.tripInfoService.trip$.subscribe(trip=>{
    if(trip){
   if (this.intrip) {
        this.currentCoords = trip.CurrentCoordinates ? {...trip.CurrentCoordinates} : null;
      }
    this.activeTrip={...trip};
    this.tripStatus=trip.tripStatus;
    this.pickupCoords={...trip.pickupCoordinates};
    this.destinationCoords={...trip.distinationCoordinates};
    }
  })
 this.tripInfoService.listofAvailableTrips$.subscribe(listOfAvailTrips=>{
  if(listOfAvailTrips){
 this.availableTrips=listOfAvailTrips.map(item=>item);

  }
  })
 
}
  setLocation(coordinates:any){
   this.currentCoords=coordinates;
       }

  setAvailable() {
    this.driverHubService.SetAsAvailable(this.currentCoords!).subscribe({next:res => {
      this.available=true;
      this.intrip=false;

    },error:err=>{
       this.errorState=true;
       this.errorMessage=err.error;
    }});

  }

  updateLocation() {
    this.driverHubService.UpdateLocation(this.currentCoords!).subscribe({next:res => {}
  ,error:err=>{
    this.errorState=true;
     this.errorMessage=err.error.Value.Message;
  }
  });
  }

  acceptTrip(id:string) {
    this.driverHubService.AcceptTrip(id).subscribe({next:res => {
            const acceptedTrip = this.availableTrips.find(trip => trip.id === id);
      if (acceptedTrip) {
          this.activeTrip = {
          ...acceptedTrip,
          tripStatus: "Accepted" 
        };
        this.tripStatus = "Accepted";
        this.intrip = true;
        this.availableTrips = [];
        this.tripInfoService.updateTrip(this.activeTrip);
      }
     
    },error: err => {
      
      this.errorState=true;
      this.errorMessage=err.error.Value.Message;
    }});

  }

  startTrip(id:string) {

    this.driverHubService.StartTrip(id).subscribe({next:res => {
               this.intrip=true;
      },
       error: err => {
       this.errorState=true;
      this.errorMessage=err.error.Value.Message;

       }});
       
  }

  endTrip(id:string) {
    this.driverHubService.EndTrip(id)
      .subscribe({next:res =>{
         console.log('Trip ended successfully', res);
         this.available=true;
         this.intrip=false;
        },
        error:err => {

          this.errorState=true;
       this.errorMessage=err.error.Value.Message;
        }});
  }
  SetAsUnavailable(){
    this.driverHubService.SetAsUnavailable().subscribe(res => {
      console.log('Driver set as unavailable', res);
    });
} 
redirectToHomepge(){
  this.router.navigate(['/driver-dashboard']);
}
acknowledgeError(){
   this.errorState=false;
  this.errorMessage=null;
}
ngOnDestroy(): void {
  this.SetAsUnavailable();
  this.available=false;
}



}


