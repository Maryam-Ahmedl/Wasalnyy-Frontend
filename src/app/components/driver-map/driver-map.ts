import { Component } from '@angular/core';
import { DriverHubService } from '../../services/driverHub.service';
import { LocationService } from '../../services/location.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-driver-map',
  imports: [FormsModule],
  templateUrl: './driver-map.html',
  styles: ``,
})
export class DriverMap {

  currentLatitude: number | null = null;
  currentLongitude: number | null = null;
  tripId: string = "";
  constructor(private driverHubService: DriverHubService, private locationService: LocationService) { }

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
}

//==> Get currect location code snippet
// this.locationService.getCurrentPosition().then(currentLocation => {
//   this.driverHubService.SetAsAvailable({Lat: currentLocation.lat, Lng: currentLocation.lng}).subscribe(res => {
//     console.log('Driver set as available', res);
//   });
// }).catch(error => {
//   console.error('Error getting current location', error);
// });
