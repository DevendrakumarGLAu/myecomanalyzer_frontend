import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { sanitizeFormValues } from '../../shared/form-sanitizer';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { PublicHeaderComponent } from '../../shared/public-header/public-header.component';
import { PublicFooterComponent } from '../../shared/public-footer/public-footer.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, NgIf, ReactiveFormsModule, RouterModule, PublicHeaderComponent, PublicFooterComponent],
  templateUrl: './signup.component.html',
})
export class SignupComponent {

  signupForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,   // ✅ inject service
    private router: Router,
    private toastService: ToastService,
    private sanitizer: DomSanitizer
  ) {
    this.signupForm = this.fb.group({
      // /auth/signup requires an alphanumeric-only username (api/auth_endpoints.py)
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      first_name: ['', [Validators.maxLength(150)]],
      last_name: ['', [Validators.maxLength(150)]],
      email: ['', [Validators.required, Validators.email]],
      mobile_number: ['', [Validators.maxLength(20)]],
      // Matches the backend's actual policy (PasswordValidator in api/auth_utils.py):
      // 8+ chars, at least one uppercase letter, one number, one special character.
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_+\-=[\]{};:,.<>?]).+$/),
      ]],
      confirm_password: ['', [Validators.required, Validators.minLength(8)]],
      use_trial: [true]
    });
  }

  signup() {
  if (this.signupForm.invalid) {
    this.errorMessage = 'Please fill all required fields correctly.';
    return;
  }

  const formValue = sanitizeFormValues(this.signupForm.value, this.sanitizer);

  if (formValue.password !== formValue.confirm_password) {
    this.errorMessage = 'Passwords do not match.';
    return;
  }

  this.authService.signupMethod(formValue).subscribe({
    next: (res) => {
      console.log('Signup successful', res);

      // /auth/signup returns access/refresh tokens directly (the old /signup
      // endpoint didn't) — log the user straight in instead of making them
      // sign in again immediately after.
      if (res?.access_token) {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('username', res.username || '');
        localStorage.setItem('first_name', res.first_name || '');
        localStorage.setItem('last_name', res.last_name || '');
        this.toastService.success('Signup successful!');
        this.router.navigate(['/user-dashboard']);
      } else {
        this.toastService.success(res.message || 'Signup successful! Please log in.');
        this.router.navigate(['/login']);
      }
    },
    error: (err) => {
      console.error(err);

      if (err.error?.detail) {
        this.toastService.error("Signup failed: Something went wrong")
        // this.toastService.error(Array.isArray(err.error.detail) ? err.error.detail.map((e: any) => e.msg).join(', ') : err.error.detail);
        if (Array.isArray(err.error.detail)) {
          this.errorMessage = err.error.detail
            .map((e: any) => e.msg)
            .join(', ');
        } else {
          this.errorMessage = err.error.detail;
        }
      } else {
        this.errorMessage = 'Signup failed. Try again.';
      }
    }
  });
}
}