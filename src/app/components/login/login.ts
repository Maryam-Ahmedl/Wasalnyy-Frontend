// src/app/components/login/login.component.ts
import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth-service';
import { LoginDto } from '../../models/login';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { GoogleLoginDto } from '../../models/GoogleLoginDto';
import { environment } from '../../../enviroments/enviroment';
import { FacebookLoginDto } from '../../models/FacebookLoginDto';
import { FacebookService } from '../../auth/facebook-service';

declare const google: any;
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  role: string = '';
  error: string = '';
  loginData: LoginDto = {
    email: '',
    password: '',
  };
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private facebookService: FacebookService
  ) {}
  ngOnInit() {
    this.role = this.route.snapshot.paramMap.get('role')!;
  }
  ngAfterViewInit() {
    this.initializeGoogleSignIn();
  }

  initializeGoogleSignIn() {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: this.handleGoogleSignIn.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          width: 250,
          text: 'signin_with',
        }
      );
    }
  }

  handleGoogleSignIn(response: any) {
    this.ngZone.run(() => {
      const googleLoginDto: GoogleLoginDto = {
        idToken: response.credential,
      };

      this.authService.googleLogin(googleLoginDto).subscribe({
        next: (res) => {
          if (res.success) {
            this.error = '';
            this.authService.saveToken(res.token);
            this.authService.saveRole('Rider'); // Google login creates Rider by default
            this.router.navigate(['']);
          } else {
            this.error = res.message || 'Google login failed';
          }
        },
        error: (err) => {
          this.error = err.error?.message || err.error || 'Google login failed';
          console.error('Google login error:', err);
        },
      });
    });
  }
  async loginWithFacebook() {
    try {
      this.error = '';

      const accessToken = await this.facebookService.loginWithFacebook();

      const facebookLoginDto: FacebookLoginDto = {
        accessToken: accessToken,
      };

      this.authService.facebookLogin(facebookLoginDto).subscribe({
        next: (res) => {
          if (res.success) {
            this.authService.saveToken(res.token!);
            this.authService.saveRole('Rider'); // Facebook login creates Rider
            this.router.navigate(['']);
          } else {
            this.error = res.message || 'Facebook login failed';
          }
        },
        error: (err) => {
          this.error =
            err.error?.message || err.error || 'Facebook login failed';
          console.error('Facebook login error:', err);
        },
      });
    } catch (error) {
      this.error =
        typeof error === 'string' ? error : 'Facebook login was cancelled';
      console.error('Facebook login error:', error);
    }
  }
  login() {
    this.loading = true;
    this.authService.login(this.loginData, this.role).subscribe({
      next: (res) => {
        this.loading = false;
        this.error = '';
        this.authService.saveToken(res.token);
        this.authService.saveRole(this.role);

        this.router.navigate([``]);
      },
      error: (err) => {
        this.loading = false;
        this.error = this.extractErrorMessage(err, 'Login failed. Please check your credentials.');
        console.error(err.error);
      },
    });
  }
  private extractErrorMessage(err: any, defaultMessage: string): string {
    if (err?.error?.message) {
      return err.error.message;
    }
    if (typeof err?.error === 'string') {
      return err.error;
    }
    if (err?.message) {
      return err.message;
    }
    return defaultMessage;
  }
  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
  rerouteToRegister() {
    console.log(this.role);
    if (this.role == 'Driver') {
      this.router.navigate(['/register-driver']);
    } else if (this.role == 'Rider') {
      this.router.navigate(['/register-rider']);
    }
  }
  rerouteToFaceLogin() {
    this.router.navigate(['/face-scan/login']);
  }
}
