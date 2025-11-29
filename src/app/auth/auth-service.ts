import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { LoginDto } from '../models/login';
import { RegisterDriverDto } from '../models/register-driver';
import { RegisterRiderDto } from '../models/register-rider';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient,private router:Router) {}

  // 🔹 Login
  login(dto: LoginDto, role?: string): Observable<any> {
    let params = new HttpParams();
    if (role) params = params.set('role', role);
    
    return this.http.post(`${this.baseUrl}/login`, dto, { params });
  }


  registerDriver(dto: RegisterDriverDto) {
     return this.http.post(`${this.baseUrl}/register/driver`, dto);
  }

  registerRider(dto: RegisterRiderDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/rider`, dto);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }
  saveRole(role: string) {
    localStorage.setItem('role', role);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['choose-user-type']);
  }
}
