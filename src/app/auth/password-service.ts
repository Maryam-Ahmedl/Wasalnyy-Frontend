import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';

@Injectable({ providedIn: 'root' })
export class PasswordService {
  private baseUrl = `${environment.apiUrl}/PasswordReset`;

  constructor(private http: HttpClient) {}

  forgotPassword(dto: any) {
    return this.http.post(`${this.baseUrl}/forgot-password`, dto);
  }

  resetPassword(dto: any) {
    return this.http.post(`${this.baseUrl}/reset-password`, dto);
  }
}
