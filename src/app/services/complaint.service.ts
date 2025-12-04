import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth-service';
import { environment } from '../../enviroments/enviroment';
import { ComplaintDto } from '../models/complaint';

@Injectable({
  providedIn: 'root',
})
export class ComplaintService {
  apiUrl:string=environment.apiUrl+'/Complaints';
  token:string=''; 
  constructor(private httpClient:HttpClient,private authService:AuthService){
    this.token=this.authService.getToken()!;

  }
   submitComplaint(complaint:ComplaintDto){
    
    const url=this.apiUrl+'/add';
    const headers= new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
    'Content-Type': 'application/json' 
          });
          return this.httpClient.post(url, complaint,{headers});
   }

   getOldComplaints(){
     const url=this.apiUrl+'/my-complaints';
        const headers= new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
    'Content-Type': 'application/json' 
          });
          return this.httpClient.get(url,{headers});
   }
}
