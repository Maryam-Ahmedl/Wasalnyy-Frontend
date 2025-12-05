import { Component } from '@angular/core';
import { RegisterRiderDto } from '../../models/register-rider';
import { AuthService } from '../../auth/auth-service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Gender } from '../../enums/gender';
import { Router } from '@angular/router';
import { PasswordValidator } from '../../validators/pass-validator';

@Component({
  selector: 'app-register-rider',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register-rider.html',
  styleUrls: ['./register-rider.css'],
})
export class RegisterRider {
  successState: boolean = false
  successMessage: string = '';
  errorState: boolean = false;
  errorMessage: string = '';
  loading = false;
  showPassword = false;
  showConfirmPassword = false;
  registerForm: FormGroup;

  genders = Object.entries(Gender)
    .filter(([key, value]) => typeof value === 'number')
    .map(([key, value]) => ({ id: value as number, name: key }));

  rider: RegisterRiderDto = {
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    Gender: 0,
    DateOfBirth: new Date(),
  };

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      FullName: ['', [Validators.required, Validators.minLength(3)]],
      Email: ['', [Validators.required, Validators.email]],
      PhoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
      Password: ['', [Validators.required, PasswordValidator.strongPassword()]],
      ConfirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      DateOfBirth: ['', Validators.required],
      Gender: ['', Validators.required],
    },
    {
      validators: PasswordValidator.matchPasswords('Password', 'ConfirmPassword')
    });
  }

  registerRider() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.successState = false;
    this.errorState = false;

    const formValue = this.registerForm.value;
    // Convert enums to numbers
    const RiderDto: RegisterRiderDto = {
      ...formValue,
      Gender: Number(formValue.Gender),
    };
    this.authService.registerRider(RiderDto).subscribe({
      next: (res) => {
        window.scroll(0, 0);
        this.loading=false;
        this.errorState = false;
        this.successState = true;
        this.successMessage = 'registration successful . redirecting to login page.'
        setTimeout(() => {

          this.router.navigate(['/login/Rider'])
        }, 1000);
      },
      error: (err) => {
        this.loading=false;
        console.error(err);
        this.errorState = true;
        this.errorMessage = this.extractErrorMessage(err, "falied to register, try again");
        window.scroll(0, 0);
      }
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
