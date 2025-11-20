import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PasswordService } from '../../auth/password-service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule,CommonModule],
  templateUrl: './reset-password.html',
  styles: ``,
})
export class ResetPassword {
email = '';
  token = '';
  newPassword = '';
  message = '';
  error = '';

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

    this.auth_path.resetPassword(dto).subscribe({
      next: () => {
        this.error = '';
        this.message = 'Password reset successfully.';
        setTimeout(() => this.router.navigate(['/login',"Rider"]), 1500);
      },
      error: (err) => {
        this.message = '';
        this.error = err.error.errors?.join(', ') ?? 'An error occurred.';
      }
    });
  }
}
