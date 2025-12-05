import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PasswordService } from '../../auth/password-service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule,CommonModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css'],
})
export class ResetPassword {
email = '';
  token = '';
  newPassword = '';
  message = '';
  error = '';
  loading : boolean = false;
  constructor(
    private route: ActivatedRoute,
    private auth_path: PasswordService,
    private router: Router
  ) {}

  ngOnInit() {
    this.email = this.route.snapshot.queryParamMap.get('email')!;
    this.token = this.route.snapshot.queryParamMap.get('token')!;
  }

  submit() {
    const dto = {
      email: this.email,
      token: this.token,
      newPassword: this.newPassword
    };
    this.loading=true;
    this.auth_path.resetPassword(dto).subscribe({
      next: () => {
        this.loading=false;
        this.error = '';
        this.message = 'Password reset successfully.';
        setTimeout(() => this.router.navigate(['/login',"Rider"]), 1500);
      },
      error: (err) => {
        this.loading =false;
        this.message = '';
        this.error = this.extractErrorMessage(err, 'Failed to reset Password');
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
