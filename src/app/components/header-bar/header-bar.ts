import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth-service';
import { Router } from '@angular/router';
import { SignalrServiceTs } from '../../services/signalr.service.ts';
@Component({
  selector: 'app-header-bar',
  imports: [],
  templateUrl: './header-bar.html',
  styleUrl: `./header-bar.css`,
})
export class HeaderBar implements OnInit{
  mainDashboard:boolean=false;
  constructor(private authService:AuthService,private router:Router,private signalrService:SignalrServiceTs){}
  ngOnInit(): void {
    const route=this.router.url.split('/');
    if(route[route.length-1]==="dashboard"){
      this.mainDashboard=true;
    }
    else{
      this.mainDashboard=false;
    }
    
  }

    logout() {
      this.signalrService.endConnection();
    this.authService.logout();
  }
    backToDashboard(){
          this.router.navigate(['./dashboard'])
        }
}
