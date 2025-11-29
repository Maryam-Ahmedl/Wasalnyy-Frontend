import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleType } from '../../enums/vehicle-type';
import { Capacity } from '../../enums/capacity';
import { transmission } from '../../enums/transmission';
import { EngineType } from '../../enums/EngineType';
import { RegisterDriverDto } from '../../models/register-driver';
import { AuthService } from '../../auth/auth-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register-driver',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterDriverComponent {
  SuccessMessageDisp:boolean=false;
  ErrorMessageDisp:boolean=false;
  messageContents:string=''
  vehicleTypes = Object.entries(VehicleType)
    .filter(([key, value]) => typeof value === 'number')
    .map(([key, value]) => ({ id: value as number, name: key }));

  capacities = Object.entries(Capacity)
    .filter(([key, value]) => typeof value === 'number')
    .map(([key, value]) => ({ id: value as number, name: key }));

  transmissions = Object.entries(transmission)
    .filter(([key, value]) => typeof value === 'number')
    .map(([key, value]) => ({ id: value as number, name: key }));

  engineTypes = Object.entries(EngineType)
    .filter(([key, value]) => typeof value === 'number')
    .map(([key, value]) => ({ id: value as number, name: key }));

  driver: RegisterDriverDto = {
    FullName: '',
    Email: '',

    PhoneNumber: '',
    Password: '',
    License: '',
    Vehicle: {
      PlateNumber: '',
      Model: '',
      Color: '',
      Make: '',
      Year: new Date().getFullYear(),
      Type: 0,
      Capacity: 4,
      Transmission: 0,
      EngineType: 0,
    }
  };

  constructor(private authService: AuthService,private router:Router) {}

  registerDriver() {
   
    this.authService.registerDriver(this.driver).subscribe({next:res=>{
      this.ErrorMessageDisp=false;
      this.SuccessMessageDisp=true;
      this.messageContents="Registration successful!"
     setTimeout(()=>{
      this.router.navigate(['/login',"Driver"]);
       },500);
          },
    error:err=>{
      this.SuccessMessageDisp=false;
      this.messageContents=err.error.message;
      this.ErrorMessageDisp=true;
    }

    });
  }
}
