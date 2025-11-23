import { Component, OnDestroy, OnInit } from '@angular/core';
import { DriverHubService } from '../../services/driverHub.service';
import { FormsModule } from '@angular/forms';
import { SignalrServiceTs } from '../../services/signalr.service.ts';

@Component({
  selector: 'app-driver-map',
  imports: [FormsModule],
  templateUrl: './driver-map.html',
  styles: ``,
})
export class DriverMap implements OnInit,OnDestroy{

  currentLatitude: number | null = null;
  currentLongitude: number | null = null;
  tripId: string = "";
  constructor(private driverHubService: DriverHubService, private signalrService: SignalrServiceTs) { }
  ngOnInit(): void {
    this.signalrService.startConnection().then(() => {
      const hubConnection = this.signalrService.getHubConnection(); 
      hubConnection.on("pendingTrip", (trip) => {
        console.log("already active in a trip:", trip);
      });
      
    })
  }

  setAvailable() {
    this.driverHubService.SetAsAvailable({ Lat: this.currentLatitude!, Lng: this.currentLongitude! }).subscribe(res => {
      console.log('Driver set as available', res);
    });

  }

  updateLocation() {
    this.driverHubService.UpdateLocation({ Lat: this.currentLatitude!, Lng: this.currentLongitude! }).subscribe(res => {
      console.log('Driver location updated', res);
    });
  }


  acceptTrip() {
    this.driverHubService.AcceptTrip(this.tripId).subscribe(res => {
      console.log('Trip accepted successfully', res);
    }, err => {
      console.error('Error accepting trip', err);
    });

  }
  // === Start a trip ===
  startTrip() {
    if (!this.tripId) return;
    this.driverHubService.StartTrip(this.tripId)
      .subscribe(res => console.log('Trip started successfully', res),
        err => console.error('Error starting trip', err));
  }

  // === End a trip ===
  endTrip() {
    if (!this.tripId) return;
    this.driverHubService.EndTrip(this.tripId)
      .subscribe(res => console.log('Trip ended successfully', res),
        err => console.error('Error ending trip', err));
  }
  SetAsUnavailable(){
    this.driverHubService.SetAsUnavailable().subscribe(res => {
      console.log('Driver set as unavailable', res);
    });
} 
ngOnDestroy(): void {
  this.SetAsUnavailable();
}
}

//import { LocationService } from '../../services/location.service';
// private locationService: LocationService,
//==> Get currect location code snippet
// this.locationService.getCurrentPosition().then(currentLocation => {
//   this.driverHubService.SetAsAvailable({Lat: currentLocation.lat, Lng: currentLocation.lng}).subscribe(res => {
//     console.log('Driver set as available', res);
//   });
// }).catch(error => {
//   console.error('Error getting current location', error);
// });
