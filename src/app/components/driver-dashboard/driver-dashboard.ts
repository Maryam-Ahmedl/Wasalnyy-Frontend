import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-driver-dashboard',
  imports: [],
  templateUrl: './driver-dashboard.html',
  styles: ``,
})
export class DriverDashboard  {
    constructor(private authService: AuthService, private router: Router) {}



setAvailable(){
 this.router.navigate(['/driver-map']);

}
goToWallet(){
    this.router.navigate(['/wallet']);
  }
  logout() {
    this.authService.logout();
  }

}
