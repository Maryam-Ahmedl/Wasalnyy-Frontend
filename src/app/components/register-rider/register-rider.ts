import { Component } from '@angular/core';
import { RegisterRiderDto } from '../../models/register-rider';
import { AuthService } from '../../auth/auth-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Gender } from '../../enums/gender';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-rider',
  imports: [FormsModule,CommonModule],
  templateUrl: './register-rider.html',
  styleUrls: ['./register-rider.css'],
})
export class RegisterRider {
  successState:boolean=false
  successMessage:string='';
  errorState:boolean=false;
  errorMessage:string='';
  genders = Object.entries(Gender)
    .filter(([key, value]) => typeof value === 'number')
    .map(([key, value]) => ({ id: value as number, name: key }));

rider: RegisterRiderDto = {
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    Gender:0,
    DateOfBirth:new Date(),
  };

  constructor(private authService: AuthService,private router:Router) {}

  registerRider() {
    this.authService.registerRider(this.rider).subscribe({
      next: (res) => {
        window.scroll(0,0);
        this.errorState=false;
        this.successState=true;
        this.successMessage='registration successful . redirecting to login page.'
      setTimeout(() => {
        
        this.router.navigate(['/login/Rider'])
      }, 1000);
      },
      error: (err) => {
        console.error(err);
        this.errorState=true;
        this.errorMessage=err.error.message;
        window.scroll(0,0);
      }
    });
  }
}
