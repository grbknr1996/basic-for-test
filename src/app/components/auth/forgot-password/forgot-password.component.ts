import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';

// Common imports
import { NgIf, NgClass, AsyncPipe } from '@angular/common';

// Services
import { AuthService } from '../../../services/auth.service';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass,
    ButtonModule,
    CardModule,
    InputTextModule,
    MessageModule,
    ProgressSpinnerModule,
    RouterLink,
    AsyncPipe,
    PasswordModule,
  ],
})
export class ForgotPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  forgotPasswordForm!: FormGroup;
  resetCodeForm!: FormGroup;
  isLoading$: Observable<boolean> = this.authService.isLoading$;
  error$: Observable<string | null> = this.authService.error$;
  submitted = false;
  codeSent = false;
  resetComplete = false;
  userEmail = '';

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.resetCodeForm = this.fb.group(
      {
        code: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6),
          ],
        ],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            // Password complexity requirements
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('newPassword')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };
  }

  onRequestCode(): void {
    this.submitted = true;

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const { email } = this.forgotPasswordForm.value;
    this.userEmail = email;

    this.authService.forgotPassword(email).subscribe({
      next: (response) => {
        this.codeSent = true;
        this.submitted = false;
      },
      error: (error) => {
        // Error is handled in the service and displayed via error$
        console.error('Password reset request error:', error);
      },
    });
  }

  onResetPassword(): void {
    this.submitted = true;

    if (this.resetCodeForm.invalid) {
      return;
    }

    const { code, newPassword } = this.resetCodeForm.value;

    this.authService
      .confirmResetPassword(this.userEmail, code, newPassword)
      .subscribe({
        next: (response) => {
          this.resetComplete = true;
        },
        error: (error) => {
          // Error is handled in the service and displayed via error$
          console.error('Password reset confirmation error:', error);
        },
      });
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }
  get r() {
    return this.resetCodeForm.controls;
  }
}
