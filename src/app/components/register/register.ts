import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleType } from '../../enums/vehicle-type';
import { Capacity } from '../../enums/capacity';
import { transmission } from '../../enums/transmission';
import { EngineType } from '../../enums/EngineType';
import { RegisterDriverDto } from '../../models/register-driver';
import { AuthService } from '../../auth/auth-service';
import { Router } from '@angular/router';
import { Gender } from '../../enums/gender';
import { PasswordValidator } from '../../validators/pass-validator';

@Component({
  selector: 'app-register-driver',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterDriverComponent {
  registerForm!: FormGroup;
  SuccessMessageDisp: boolean = false;
  ErrorMessageDisp: boolean = false;
  messageContents: string = '';
  currentYear = new Date().getFullYear();
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  loading: boolean = false;

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

  genders = Object.entries(Gender)
    .filter(([key, value]) => typeof value === 'number')
    .map(([key, value]) => ({ id: value as number, name: key }));

  vehicleYears: number[] = Array.from({ length: this.currentYear - 1989 }, (_, i) => this.currentYear - i);
  // driver: RegisterDriverDto = {
  //   FullName: '',
  //   Email: '',
  //   Gender: 0,
  //   DateOfBirth: new Date(),
  //   PhoneNumber: '',
  //   Password: '',
  //   License: '',
  //   Vehicle: {
  //     PlateNumber: '',
  //     Model: '',
  //     Color: '',
  //     Make: '',
  //     Year: new Date().getFullYear(),
  //     Type: 0,
  //     Capacity: 4,
  //     Transmission: 0,
  //     EngineType: 0,
  //   },
  // };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm()
  }
  createForm() {
    this.registerForm = this.fb.group({
      FullName: ['', [Validators.required, Validators.minLength(3)]],
      Email: ['', [Validators.required, Validators.email]],
      PhoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
      Password: ['', [Validators.required, PasswordValidator.strongPassword()]],
      ConfirmPassword: ['', Validators.required],
      License: ['', [Validators.required, Validators.minLength(4)]],
      DateOfBirth: [new Date().toISOString().split('T')[0], Validators.required],
      Gender: ['', Validators.required],

      Vehicle: this.fb.group({
        PlateNumber: ['', [Validators.required, Validators.minLength(6)]],
        Model: ['', Validators.required],
        Color: ['', Validators.required],
        Make: ['', Validators.required],
        Year: ['', [Validators.required, Validators.min(1990), Validators.max(this.currentYear)]],
        Type: ['', Validators.required],
        Capacity: ['', Validators.required],
        Transmission: ['', Validators.required],
        EngineType: ['', Validators.required]
      })
    }, {
      validators: PasswordValidator.matchPasswords('Password', 'ConfirmPassword')
    });
  }
  registerDriver() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      window.scrollTo(0, 0);
      return;
    }
    this.loading = true;
    const formValue = this.registerForm.value;
    // Convert enums to numbers
    const driverDto: RegisterDriverDto = {
      ...formValue,
      Gender: Number(formValue.Gender),
      Vehicle: {
        ...formValue.Vehicle,
        Type: Number(formValue.Vehicle.Type),
        Capacity: Number(formValue.Vehicle.Capacity),
        Transmission: Number(formValue.Vehicle.Transmission),
        EngineType: Number(formValue.Vehicle.EngineType),
        Year: Number(formValue.Vehicle.Year)
      }
    };
    this.authService.registerDriver(driverDto).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.ErrorMessageDisp = false;
        this.SuccessMessageDisp = true;
        this.messageContents = 'Registration successful!';
        console.log(res);
        setTimeout(() => {
          this.router.navigate(['/face-scan/register', res.driverId]);
        }, 500);
      },
      error: (err) => {
        this.loading = false;
        this.SuccessMessageDisp = false;
        this.ErrorMessageDisp = true;
        this.messageContents = this.extractErrorMessage(err, 'Registration failed. Please try again.');
        window.scroll(0, 0);
      },
    });
  }
  private extractErrorMessage(err: any, defaultMessage: string): string {
    if (err?.error?.message) return err.error.message;
    if (typeof err?.error === 'string') return err.error;
    if (err?.statusText && err.statusText !== 'Unknown Error') return err.statusText;
    if (err?.message) return err.message;
    return defaultMessage;
  }

}
