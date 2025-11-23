import { Component, OnDestroy, OnInit } from '@angular/core';
import { Coordinates, TripRequestDto } from '../../models/trip-request.dto';
import { TripService } from '../../services/trip.service';
import { FormsModule } from '@angular/forms';
import { SignalrServiceTs } from '../../services/signalr.service.ts';
import { PaymentMethod } from '../../enums/PaymentMethod';

@Component({
  selector: 'app-rider-map',
  imports: [FormsModule],
  templateUrl: './rider-map.html',
  styles: ``,
})
export class RiderMap implements OnInit,OnDestroy {
  currentLatitude: string | null = null;
  currentLongitude: string | null = null;
  destinationLatitude: string | null = null;
  destinationLongitude: string | null = null;
  paymentMethod: PaymentMethod | null = null;

  constructor(private tripService: TripService, private signalrService: SignalrServiceTs) {}

ngOnInit(): void {

  this.signalrService.startConnection().then(() => {
    const hubConnection = this.signalrService.getHubConnection();
    hubConnection.on("pendingTrip", (trip) => {
    console.log("already active in a trip:", trip);

      });
  hubConnection.on('tripAccepeted', (driver) => {
          console.log('your trip has been accepted by driver:', driver);
        });
  hubConnection.on('tripStarted', (trip) => {
          console.log('Trip started:', trip);
  });
  hubConnection.on('tripEnded', () => {
          console.log('Trip ended');
  });      

  });
}

  requestTrip(): void {
    if (!this.signalrService.connectionStarted) {
      console.warn('Hub is not connected yet. Please wait...');
      return;
    }

    if (!this.currentLatitude || !this.currentLongitude || !this.destinationLatitude || !this.destinationLongitude || this.paymentMethod === null) {
      console.warn('Please fill all fields.');
      return;
    }

    const request: TripRequestDto = {
      PaymentMethod: this.paymentMethod,
      PickupCoordinates: { Lat: +this.currentLatitude, Lng: +this.currentLongitude },
      DistinationCoordinates: { Lat: +this.destinationLatitude, Lng: +this.destinationLongitude },
    };

    console.log('Sending trip request:', request);

    this.tripService.requestTrip(request).subscribe({
      next: (res) => console.log('Trip requested successfully:', res),
      error: (err) => console.error('Error requesting trip:', err),
    });
  }

  ngOnDestroy() {
  const hub = this.signalrService.getHubConnection();
  hub.off("pendingTrip");
  hub.off("tripAccepeted");
  hub.off("tripStarted");
  hub.off("tripEnded");
}
}
