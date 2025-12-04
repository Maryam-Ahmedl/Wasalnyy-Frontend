import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth-service';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AccountDataService {
  private ApiUrl=environment.apiUrl;
  private token:string='';
  private role:string=''
    constructor(private httpClient:HttpClient,private authService:AuthService){}
  
  getUserData(){
       const token= this.authService.getToken()!;
      const role=this.authService.getRole()!;
     const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json' 
          });
   const url=`${this.ApiUrl}/${role}/Profile`;
   return this.httpClient.get(url,{headers});
  }
  getDriverData(driverId:string){
    const url=`${this.ApiUrl}/Rider/DriverData`;
           const token= this.authService.getToken()!;
      const role=this.authService.getRole()!;
     const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json' 
          });
    return this.httpClient.post(url, `"${driverId}"`,{headers});
  }
  
  }
