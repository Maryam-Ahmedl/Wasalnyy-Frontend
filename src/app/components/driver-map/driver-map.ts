import { Component, OnDestroy, OnInit } from '@angular/core';
import { DriverHubService } from '../../services/driverHub.service';
import { FormsModule } from '@angular/forms';
import { TripInfoService } from '../../services/trip-info.service';
import { MapComponent } from '../map-component/map-component';
import { Coordinates } from '../../models/trip-request.dto';
import { Router } from '@angular/router';
import { TripComponent } from '../trip-component/trip-component';
import { MessageBox } from '../message-box/message-box';
import { ReviewBox } from '../review-box/review-box';
import { ReviewsService } from '../../services/reviews.service';
import { TripRequestService } from '../../services/trip-request.service';
@Component({
  selector: 'app-driver-map',
  imports: [FormsModule,MapComponent,TripComponent,MessageBox,ReviewBox],
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
  messageState:boolean=false;
  message:string|null=null;
  errorMessage:string|null=null;

  constructor(private driverHubService: DriverHubService,private tripInfoService:TripInfoService
    ,private router:Router,private reviewService:ReviewsService,private tripRequestService:TripRequestService) { }
ngOnInit(): void {
  this.tripInfoService.Intrip$.subscribe(intrip=>{
    this.intrip=intrip;
    this.available=intrip;
 })
  this.tripInfoService.trip$.subscribe(trip=>{
    if(trip){
      if(trip.tripStatus==="Cancelled"){
       this.activeTrip = {...trip};
        this.tripStatus = null;
       this.currentCoords = null;
       this.pickupCoords = null;
       this.destinationCoords = null;
      this.messageState=true;
      this.message="Trip cancelled";
      }
      else if (trip.tripStatus==="Ended"){
        this.activeTrip = {...trip};
        this.tripStatus = null;
       this.currentCoords = null;
       this.pickupCoords = null;
       this.destinationCoords = null;

           this.messageState=true;
           if(this.activeTrip.paymentMethod==="Cash"){
            this.message=`destination reached. please collect $${this.activeTrip.price} from rider`
           }
           else {
            this.message=`destination reached. Trip fare deducted from client's wallet`
           }
      }

      else{
       if (this.intrip) {
                this.currentCoords = trip.CurrentCoordinates ? {...trip.CurrentCoordinates} : null;
              }
            this.activeTrip={...trip};
            this.tripStatus=trip.tripStatus;
            this.pickupCoords={...trip.pickupCoordinates};
            this.destinationCoords={...trip.destinationCoordinates};
            }
      }
  })
 this.tripInfoService.listofAvailableTrips$.subscribe(listOfAvailTrips=>{
  if(listOfAvailTrips){
 this.availableTrips=listOfAvailTrips.map(item=>item);

  }else{
    this.availableTrips=[]
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
    this.driverHubService.UpdateLocation(this.currentCoords!).subscribe({next:res => {
      console.log("location updated!")
    }
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
cancelTrip(tripId:any){
  if(this.activeTrip){
    
    this.tripRequestService.CancelTrip(tripId).subscribe({
      next:(res)=>{

      },error:(err)=>{
        console.error('Error:',err);
        this.errorState=true;
        this.errorMessage=err.error.Value.Message;
      }
    })
  }
  else{
    this.tripInfoService.removeTripFromListOfAvailableTrips(tripId);
    this.availableTrips=this.availableTrips.filter(trip=>trip.id!==tripId)
  }
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
         this.intrip=true;
         this.errorState=true;
         this.activeTrip={...this.activeTrip,tripStatus:"Ended"};
        },
        error:err => {

          this.errorState=true;
       this.errorMessage=err.error.Value.Message;
        }});
  }
  SetAsUnavailable(){
    this.driverHubService.SetAsUnavailable().subscribe(res => {
      this.available=false;
      console.log('Driver set as unavailable', res);
    });
} 
redirectToHomepge(){
  this.router.navigate(['/dashboard']);
}
acknowledgeError(){

    this.messageState=false;
     this.available=true;
    this.errorState=false;
    this.errorMessage=null;

    if(this.activeTrip.tripStatus==="Cancelled"){
      this.tripInfoService.clearTrip();
    
  }
 
}
ngOnDestroy(): void {
  this.SetAsUnavailable();
  this.available=false;
}

 submitReview(reviewBody:any){
    this.reviewService.submitReview(reviewBody).subscribe({
      next:res=>{
        console.log("review Successful");
        this.activeTrip=null;
        this.tripInfoService.setInTrip(false);
        this.tripInfoService.clearTrip();
        this.messageState=true;
        this.message="Thank you!"
        
      },
      error:err=>{
      console.error('Error:',err);
      this.errorState=true;
      this.errorMessage=err.error.Value.Message;
      }
    })
  }



}


