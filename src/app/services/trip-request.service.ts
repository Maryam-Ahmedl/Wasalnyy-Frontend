import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';
import { AuthService } from '../auth/auth-service';
import { TripRequestDto } from '../models/trip-request.dto';
@Injectable({
  providedIn: 'root',
})
export class TripRequestService {
 private apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient, private authService: AuthService) {}
  requestTrip(dto:TripRequestDto) {
    const token = this.authService.getToken();

    const formData = new FormData();
    formData.append('PaymentMethod', dto.PaymentMethod.toString());
    formData.append('PickupCoordinates.Lat', dto.PickupCoordinates.Lat.toString());
    formData.append('PickupCoordinates.Lng', dto.PickupCoordinates.Lng.toString());
    formData.append('PickUpName',dto.PickupCoordinates.locationName!);
    formData.append('DistinationCoordinates.Lat', dto.DistinationCoordinates.Lat.toString());
    formData.append('DistinationCoordinates.Lng', dto.DistinationCoordinates.Lng.toString());
    formData.append('DestinationName',dto.DistinationCoordinates.locationName!);
    console.log(formData)

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.apiUrl}/Trip/Request`;
    return this.http.post(url, formData, { headers });
  }
  confirmTripRequest(tripId:string){
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const url = `${this.apiUrl}/Trip/Confirm/${tripId}`;
    return this.http.post(url,null, { headers });
  

  }
  CancelTrip(tripId:string){
        const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
        const url = `${this.apiUrl}/Trip/CancelTrip/${tripId}`;
    return this.http.post(url,null, { headers });
  }
}
