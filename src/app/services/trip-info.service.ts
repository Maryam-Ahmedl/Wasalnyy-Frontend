import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { TripStatus } from '../enums/tripStatus';

@Injectable({
  providedIn: 'root',
})
export class TripInfoService {
  private trip=new BehaviorSubject<any>(null);
  trip$=this.trip.asObservable();
  
  private listofAvailableTrips=new BehaviorSubject<any[]>([]);
  listofAvailableTrips$=this.listofAvailableTrips.asObservable();
   
  private driver =new BehaviorSubject<any>(null);
  driver$=this.driver.asObservable();
  
  private Intrip =new BehaviorSubject<boolean>(false);
  Intrip$=this.Intrip.asObservable();

updateTrip(tripData: any) {
    this.trip.next(tripData);
    if(this.listofAvailableTrips.value){
      this.clearListOfAvailableTrips();
    }
  }
  updateTripStatus(Status:string){
    const OldTrip=this.trip.value;
    const newTrip={...OldTrip,tripStatus:Status};
    this.trip.next(newTrip);
  }

  updateTripCoords(Coords: any) {
  const currentTrip = this.trip.value;
  const newTrip = {
    ...currentTrip,
    CurrentCoordinates: {...Coords}
  };
  this.trip.next(newTrip); 
}
  updateDriver(driverData: any) {
    this.driver.next(driverData);
    const coordinates=driverData.coordinates;
    const currentTrip=this.trip.value;
    const newTrip={...currentTrip,CurrentCoordinates:{...coordinates},tripStatus:"Accepted"}
    this.updateTrip(newTrip);    
  }
  updateDriverCoords(Coords:any){
    let driverData=this.driver.value;
    const newDriver={...driverData,Coordinates:{...Coords}};
    this.driver.next(newDriver);
    this.updateTripCoords(Coords);
    
  }
  clearTrip() {
    this.trip.next(null);
  }
  clearDriver() {
    this.driver.next(null);
  }
  setInTrip(status: boolean) {
    this.Intrip.next(status);
  }
  get isInTripValue() {
  return this.Intrip.value;
}

  updateListOfAvailableTrips(trip: any) {
      const currentList = this.listofAvailableTrips.value;
     const updatedList = [...currentList, trip]; 
   this.listofAvailableTrips.next(updatedList);
  }
  
  clearListOfAvailableTrips() {
    this.listofAvailableTrips.next( []);
  }
  removeTripFromListOfAvailableTrips(tripId:string){
    const currentList=this.listofAvailableTrips.value;
    const updatedList=currentList.filter(trip=>trip.id!==tripId);
    this.listofAvailableTrips.next(updatedList);
  }
}