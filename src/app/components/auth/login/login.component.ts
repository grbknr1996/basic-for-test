import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable, finalize, switchMap } from 'rxjs';
// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
// Common imports
import { NgIf, NgClass, CommonModule } from '@angular/common';
// Services
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass,
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    DividerModule,
    MessageModule,
    ProgressSpinnerModule,
    CommonModule,
    RouterLink,
  ],
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm!: FormGroup;
  isLoading$: Observable<boolean> = this.authService.isLoading$;
  error$: Observable<string | null> = this.authService.error$;
  submitted = false;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false],
    });
  }

  onSubmit(): void {
    console.log(this.loginForm.value);
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService
      .login(email, password)
      .pipe(
        // After login succeeds, explicitly check auth status
        switchMap((response) => {
          console.log('Login response:', response);

          // Handle force change password case
          if (
            response.nextStep?.signInStep ===
            'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED'
          ) {
            this.router.navigate(['/force-change-password']);
            return [response]; // Return response as observable
          }

          // Only proceed with auth check if sign-in was successful
          if (response.isSignedIn) {
            console.log('Sign-in successful, checking auth status');
            // Wait for auth status check to complete before navigating
            return this.authService.checkAuthStatus().pipe(
              finalize(() => {
                console.log('Auth check completed after login');
                const defaultOffice =
                  environment.installedInstances[0] || 'default';

                // Navigate to office-specific dashboard
                this.router.navigate([`/${defaultOffice}/dashboard`]);
                // Now that auth status is confirmed, navigate to dashboard
                //this.router.navigate(['/dashboard/']);
              })
            );
          }

          return [response]; // Return response as observable for other cases
        })
      )
      .subscribe({
        error: (error) => {
          // Error is handled in the service and displayed via error$
          console.error('Login error:', error);
        },
      });
  }

  get f() {
    return this.loginForm.controls;
  }
}
