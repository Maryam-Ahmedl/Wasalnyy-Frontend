import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterDriverComponent } from './components/register/register';
import { RegisterRider } from './components/register-rider/register-rider';
import { ChooseUserComponent } from './components/reg-option/reg-option';
import { FaceScan } from './components/face-scan/face-scan';
import { DriverDashboard } from './components/driver-dashboard/driver-dashboard';
import { RiderDashboard } from './components/rider-dashboard/rider-dashboard';
import { PaymentSuccessful } from './components/payment-successful/payment-successful';
import { PaymentFailed } from './components/payment-failed/payment-failed';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { AuthGuard } from './auth/auth-guard';
import { DashboardRedirectComponent } from './components/dashboard-redirect/dashboard-redirect';
import { ResetPassword } from './components/reset-password/reset-password';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { DriverMap } from './components/driver-map/driver-map';
import { RiderMap } from './components/rider-map/rider-map';
import { Wallet } from './components/wallet/wallet';

export const routes: Routes = [
  // default route redirects based on login status
  { path: '', component: DashboardRedirectComponent },
  { path: 'login/:role', component: LoginComponent },
  { path: 'choose-user-type', component: ChooseUserComponent, pathMatch:'full' },
  { path: 'register-driver', component: RegisterDriverComponent },
  { path: 'register-rider', component: RegisterRider },
  { path: 'face-scan/register/:userId', component: FaceScan },
  { path: 'face-scan/login', component: FaceScan },

  { path: 'driver-dashboard', component: DriverDashboard, canActivate: [AuthGuard], data: { role: 'Driver' } },
  { path: 'rider-dashboard', component: RiderDashboard, canActivate: [AuthGuard], data: { role: 'Rider' } },
  { path: 'admin-dashboard', component: AdminDashboard, canActivate: [AuthGuard], data: { role: 'Admin' } },

  { path: 'reset-password', component: ResetPassword },
  { path: 'forgot-password', component: ForgotPassword },
  { path:`driver-map`,component:DriverMap, canActivate: [AuthGuard], data: { role: 'Driver' }},
  { path:`rider-map`,component:RiderMap, canActivate: [AuthGuard], data: { role: 'Rider' }},
  { path:'wallet',component:Wallet, canActivate: [AuthGuard]},

  { path: 'payment-failed', component: PaymentFailed },
  { path: 'payment-successful', component: PaymentSuccessful },

  { path: '**', redirectTo: '' } // fallback to dashboard redirect
];
