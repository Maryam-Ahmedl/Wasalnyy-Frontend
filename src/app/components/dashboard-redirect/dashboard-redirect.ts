import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth-service';
import { SignalrServiceTs } from '../../services/signalr.service.ts';
import { TripInfoService } from '../../services/trip-info.service';

@Component({
  selector: 'app-dashboard-redirect',
  templateUrl: './dashboard-redirect.html',
  styleUrls: ['./dashboard-redirect.css']
})
export class DashboardRedirectComponent implements OnInit {

  constructor(private router: Router,private authService: AuthService
    ,private signalrService: SignalrServiceTs,private tripInfoService: TripInfoService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    const role = this.authService.getRole()?.toLowerCase();
   if(!token||!role) this.router.navigate(['/choose-user-type']);
   else {
     this.signalrService.startConnection().then(() => {
      setTimeout(()=>{
       if(this.tripInfoService.isInTripValue) {
          this.router.navigate([`/${role}-map`]);
        }else{
           this.router.navigate([`/${role}-dashboard`]);
        } 

      },200);

     });

   }
  }
}
