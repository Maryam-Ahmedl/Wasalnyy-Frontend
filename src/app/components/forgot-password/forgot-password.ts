import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PasswordService } from '../../auth/password-service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule,CommonModule],
  templateUrl: './forgot-password.html',
  styles: ``,
})
export class ForgotPassword {

  email = '';
  message = '';
  error = '';

  constructor(private auth_path: PasswordService) { }

  submit() {
    const data = {
      email: this.email,
      Url: "http://localhost:4200"   // Angular URL
    };

    this.auth_path.forgotPassword(data).subscribe({
      next: () => {
        this.error = '';
        this.message = 'Reset link sent. Check your email.';
      },
      error: (err) => {
        this.message = '';
        this.error = err.error;
      }
    });
  }
}
