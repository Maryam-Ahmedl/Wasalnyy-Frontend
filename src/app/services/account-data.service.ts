import { Injectable } from '@angular/core';
import { HttpClient } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth-service';

@Injectable({
  providedIn: 'root',
})
export class AccountDataService {
    private user=new BehaviorSubject<any>(null);
    user$=this.user.asObservable();
    constructor(private httpClient:HttpClient,private authService:AuthService){}
  updateUser(user:any){
    this.user.next(user);
  }
  getUserData(){
   const token= this.authService.getToken();
  }
  }
