import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';

// Common imports
import { NgIf, NgClass, AsyncPipe } from '@angular/common';

// Services
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-force-change-password',
  templateUrl: './force-change-password.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass,
    ButtonModule,
    CardModule,
    PasswordModule,
    MessageModule,
    ProgressSpinnerModule,
    AsyncPipe,
  ],
})
export class ForceChangePasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  passwordForm!: FormGroup;
  isLoading$: Observable<boolean> = this.authService.isLoading$;
  error$: Observable<string | null> = this.authService.error$;
  submitted = false;

  ngOnInit(): void {
    // Redirect if no temp user exists (user shouldn't be on this page)
    if (!this.authService.hasTempUser()) {
      this.router.navigate(['/login']);
      return;
    }

    this.passwordForm = this.fb.group(
      {
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

  onSubmit(): void {
    this.submitted = true;

    if (this.passwordForm.invalid) {
      return;
    }

    const { newPassword } = this.passwordForm.value;

    this.authService.completeNewPassword(newPassword).subscribe({
      next: (response) => {
        if (response.isSignedIn) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        // Error is handled in the service and displayed via error$
        console.error('Password change error:', error);
      },
    });
  }

  get f() {
    return this.passwordForm.controls;
  }
}
