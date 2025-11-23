import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth-service';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { SignalrServiceTs } from '../../services/signalr.service.ts';

@Component({
  selector: 'app-rider-dashboard',
  imports: [FormsModule],
  templateUrl: './rider-dashboard.html',
  styles: ``,
})
export class RiderDashboard implements OnInit {

  constructor(private authService: AuthService, private router: Router, private signalrService: SignalrServiceTs) {}
ngOnInit(): void {

  this.signalrService.startConnection().then(() => {
    const hubConnection = this.signalrService.getHubConnection();
    hubConnection.on("pendingTrip", (trip) => {
    console.log("already active in a trip:", trip);
    this.signalrService.endConnection().then(() => {
      this.requestRide();
    });
    

  });
  });
}

goToWallet(){
    this.router.navigate(['/wallet']);
  }
  requestRide(){
    this.router.navigate(['/rider-map']);
  }

  logout() {
    this.authService.logout();
  }
}
