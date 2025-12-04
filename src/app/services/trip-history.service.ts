import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders ,HttpParams} from '@angular/common/http';
import { AuthService } from '../auth/auth-service';
import { environment } from '../../enviroments/enviroment';
import { TripsHistoryDto } from '../models/tripHistoryDto';

@Injectable({
  providedIn: 'root',
})
export class TripHistoryService {
  apiUrl:string=environment.apiUrl;
  role:string='';
  token:string='';
  constructor(private httpClient:HttpClient,private authService:AuthService){}
  requestTripHistory(requestBody:TripsHistoryDto){
    this.role=this.authService.getRole()!;
    this.token=this.authService.getToken()!;
    const headers=new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
       'Content-Type': 'application/json'
    })
    const params=new HttpParams().set('orderBy',requestBody.orderBy)
    .set('descending',requestBody.descending).set('pageNumber',requestBody.pageNumber.toString()).set('pageSize',requestBody.pageSize);


     return this.httpClient.get(`${this.apiUrl}/${this.role}/TripsHistory`,{headers,params});

  }

}
