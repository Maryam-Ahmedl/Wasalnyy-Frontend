// src/app/components/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth-service';
import { LoginDto } from '../../models/login';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  role: string ="";
  error: string = '';
  loginData: LoginDto = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService,private route:
    ActivatedRoute,private router: Router
  ) {}
  ngOnInit() {
    this.role = this.route.snapshot.paramMap.get('role')!;
  }

  login() {
    this.authService.login(this.loginData,this.role).subscribe({
      next: (res) => {
        this.error='';
        this.authService.saveToken(res.token);
        this.authService.saveRole(this.role);
        let rolePath = this.role.toLowerCase() + '-dashboard';
        this.router.navigate([`/${rolePath}`]);

      },
      error: (err) => {
        this.error = err.error;
        console.error(err.error);
      }
    });
  }
  goToForgotPassword() {
  this.router.navigate(['/forgot-password']);
}
  rerouteToRegister(){
    console.log(this.role)
    if(this.role=="Driver"){
      this.router.navigate(['/register-driver']);
    }else if(this.role=="Rider"){
      this.router.navigate(['/register-rider']);
  }
}
rerouteToFaceLogin(){
    this.router.navigate(['/face-scan/login']);
}

}
