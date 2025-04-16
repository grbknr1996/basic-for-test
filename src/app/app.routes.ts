import { Routes } from "@angular/router";
import { LoginComponent } from "./components/auth/login/login.component";
import { SignupComponent } from "./components/auth/signup/signup.component";
import { ForgotPasswordComponent } from "./components/auth/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./components/auth/reset-password/reset-password.component";
import { ForceChangePasswordComponent } from "./components/auth/force-change-password/force-change-password.component";
import { AuthGuard } from "./guards/auth.guard";
import { GuestGuard } from "./guards/guest.guard";
import { DashboardComponent } from "./components/dashboard/dashboard.component";

export const routes: Routes = [
  // Auth routes
  {
    path: "login",
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: "signup",
    component: SignupComponent,
    canActivate: [GuestGuard],
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
    canActivate: [GuestGuard],
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent,
    canActivate: [GuestGuard],
  },
  {
    path: "force-change-password",
    component: ForceChangePasswordComponent,
    canActivate: [GuestGuard],
  },

  // Application routes
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },

  // Default routes
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "**", redirectTo: "/login" },
];
