import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PasswordService } from '../../auth/password-service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css'],
})
export class ForgotPassword {

  email = '';
  message = '';
  error = '';
  loading: boolean = false;
  constructor(private auth_path: PasswordService) { }

  submit() {
    this.loading = true;
    const data = {
      email: this.email,
      Url: "http://localhost:4200"   // Angular URL
    };

    this.auth_path.forgotPassword(data).subscribe({
      next: () => {
        this.loading = false;
        this.error = '';
        this.message = 'Reset link sent. Check your email.';
      },
      error: (err) => {
        this.loading = false;
        this.message = '';
        this.error = this.extractErrorMessage(err, 'Failed to send reset link');
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

