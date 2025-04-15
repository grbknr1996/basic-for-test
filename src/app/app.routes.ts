import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { ForceChangePasswordComponent } from './components/auth/force-change-password/force-change-password.component';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { environment } from '../environments/environment';

// Auth routes remain unchanged
const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'force-change-password',
    component: ForceChangePasswordComponent,
    canActivate: [GuestGuard],
  },
];

// Office-specific routes
const officeRoutes: Routes = [];

// Create routes for each installed office
environment.installedInstances.forEach((office) => {
  officeRoutes.push({
    path: office,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      // Default redirect for office path
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  });
});

// The main routes configuration
export const routes: Routes = [
  // Include auth routes (login, signup, etc.)
  ...authRoutes,

  // Include office-specific routes
  ...officeRoutes,

  // Keep existing dashboard route for backward compatibility
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },

  // Default route
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },

  // Wildcard route
  {
    path: '**',
    redirectTo: '/login',
  },
];
