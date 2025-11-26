import { Component, EventEmitter, Output } from '@angular/core';
import { SearchBar } from '../searchbar/searchbar';
import { Coordinates } from '../../models/trip-request.dto';
import { LocationResult } from '../../models/location-result'; 
import { FormsModule } from '@angular/forms';
import { TripRequestService } from '../../services/trip-request.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth-service';

@Component({
  imports: [SearchBar, FormsModule],
  selector: 'app-rider-sidebar',
  templateUrl: './rider-sidebar.html',
  styleUrls: ['./rider-sidebar.css']
})
export class RiderSideBar {

  // These outputs emit the selected coordinates to the map
  @Output() originSelected = new EventEmitter<LocationResult>();
  @Output() destinationSelected = new EventEmitter<LocationResult>();
  @Output() paymentMethodSelected=new EventEmitter<number>();
  @Output() tripRequested = new EventEmitter<any>();
  originCoords?: Coordinates;
  destinationCoords?: Coordinates;
  paymentMethod: number | null = null;
  canRequestTrip: boolean = false;
  role:string|null=null;

  constructor(private tripRequestService: TripRequestService ,private router:Router,private authservice:AuthService) {}


  onOriginSelected(location: LocationResult) {
     this.originSelected.emit(location);
 }

onDestinationSelected(location: LocationResult) {
  this.destinationSelected.emit(location)
 }

onChangePaymentMethod(event: any) {
  if(this.paymentMethod!==null){
    this.paymentMethodSelected.emit(this.paymentMethod);
  }
  
}

requestTrip() {
  this.tripRequested.emit(true);
}
redirectToHomepge(){
  this.router.navigate(['/rider-dashboard']);
}

}
