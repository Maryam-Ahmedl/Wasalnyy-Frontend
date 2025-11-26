import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth-service';
import { Router } from '@angular/router';
import { TripInfoService } from '../../services/trip-info.service';

@Component({
  selector: 'app-rider-dashboard',
  imports: [FormsModule],
  templateUrl: './rider-dashboard.html',
  styles: ``,
})
export class RiderDashboard implements OnInit{
  riderMapString: string = "Request A Ride";

  constructor(private authService: AuthService, private router: Router,private tripInfoService: TripInfoService) {}
ngOnInit(): void {
  this.tripInfoService.Intrip$.subscribe(intrip=>{
  this.riderMapString=intrip?"Go To Trip":"Request A Ride";
  })
 }
goToWallet(){
  this.router.navigate(['/wallet']);
  }
  requestRide(){
   this.router.navigate(['/rider-map'])
      }

  logout() {
    this.authService.logout();
  }
}
