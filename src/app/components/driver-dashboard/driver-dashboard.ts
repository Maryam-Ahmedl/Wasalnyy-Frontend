import { Component, OnDestroy,OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth-service';
import { Router } from '@angular/router';
import { SignalrServiceTs } from '../../services/signalr.service.ts';


@Component({
  selector: 'app-driver-dashboard',
  imports: [],
  templateUrl: './driver-dashboard.html',
  styles: ``,
})
export class DriverDashboard implements OnInit,OnDestroy {
    constructor(private authService: AuthService, private router: Router, private signalrService: SignalrServiceTs) {}

ngOnInit(): void {

  this.signalrService.startConnection().then(() => {
    const hubConnection = this.signalrService.getHubConnection();
    hubConnection.on("pendingTrip", (trip) => {
    console.log("already active in a trip:", trip);
    this.signalrService.endConnection().then(() => {
      this.setAvailable();
    })
  });
      
})}

setAvailable(){
this.router.navigate(['/driver-map']);

}
goToWallet(){
    this.router.navigate(['/wallet']);
  }
  logout() {
    this.authService.logout();
  }

ngOnDestroy(): void {
  this.signalrService.endConnection();
  // set unavailable when component is destroyed
}
}
