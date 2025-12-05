import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterDriverComponent } from './components/register/register';
import { RegisterRider } from './components/register-rider/register-rider';
import { ChooseUserComponent } from './components/reg-option/reg-option';
import { FaceScan } from './components/face-scan/face-scan';
import { Dashboard } from './components/dashboard/dashboard';
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
import { TripHistory } from './components/trip-history/trip-history';
import { Profile } from './components/profile/profile';
import { AdminDriversComponent } from './components/admin-driver/admin-driver';
import { AdminRidersComponent } from './components/admin-rider/admin-rider';
import { AdminTripsComponent } from './components/admin-trips/admin-trips';
import { AdminReportsComponent } from './components/admin-reports/admin-reports';
import { AdminComplaintsComponent } from './components/admin-complaints/admin-complaints';
import { DriverAccountComponent } from './components/Driver-profile/driver-account';
import { RiderAccountComponent } from './components/rider-account/rider-account';

import { SubmitComplaint } from './components/submit-complaint/submit-complaint';
import { ComplaintHistory } from './components/complaint-history/complaint-history';

export const routes: Routes = [
  { path: '', component: DashboardRedirectComponent },
  { path: 'login/:role', component: LoginComponent },
  { path: 'choose-user-type', component: ChooseUserComponent, pathMatch:'full' },
  { path: 'register-driver', component: RegisterDriverComponent },
  { path: 'register-rider', component: RegisterRider },
  { path: 'face-scan/register/:userId', component: FaceScan },
  { path: 'face-scan/login', component: FaceScan },

  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  {path:'history',component:TripHistory,canActivate:[AuthGuard]},
  {path:'profile',component: Profile,canActivate:[AuthGuard]},
  { path: 'admin-dashboard', component: AdminDashboard ,canActivate:[AuthGuard],data:{role:'Admin'}},

  {path:'submit-complaint/:tripId',component:SubmitComplaint,canActivate:[AuthGuard]},
  {path:'view-complaints',component:ComplaintHistory,canActivate:[AuthGuard]},
  { path: 'reset-password', component: ResetPassword},
  { path: 'forgot-password', component: ForgotPassword},

  { path:`driver-map`,component:DriverMap, canActivate: [AuthGuard], data: { role: 'Driver' }},
  { path:`rider-map`,component:RiderMap, canActivate: [AuthGuard], data: { role: 'Rider' }},

  { path:'wallet',component:Wallet, canActivate: [AuthGuard]},
  { path: 'payment-failed', component: PaymentFailed ,canActivate:[AuthGuard],data:{role:'Rider'}},
  { path: 'payment-successful', component: PaymentSuccessful,canActivate:[AuthGuard],data:{role:'Rider'} },
  {path:'admin/drivers',component:AdminDriversComponent,canActivate:[AuthGuard],data:{role:'Admin'}},
  {path:'admin/riders',component:AdminRidersComponent,canActivate:[AuthGuard],data:{role:'Admin'}},
  {path:'admin/trips',component:AdminTripsComponent,canActivate:[AuthGuard],data:{role:'Admin'}},
  {path:'admin/reports',component:AdminReportsComponent,canActivate:[AuthGuard],data:{role:'Admin'}},
  {path:'admin/complaints',component:AdminComplaintsComponent,canActivate:[AuthGuard],data:{role:'Admin'}},
  {path: 'driveraccount',component:DriverAccountComponent,canActivate:[AuthGuard],data:{role:'Driver'}},
  {path: 'rideraccount',component:RiderAccountComponent,canActivate:[AuthGuard],data:{role:'Rider'}},


  { path: '**', redirectTo: '' }
];
