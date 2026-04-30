import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, NgIf, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
})
export class SignupComponent {

  signupForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,   // ✅ inject service
    private router: Router,
    private toastService: ToastService
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      first_name: ['', [Validators.maxLength(150)]],
      last_name: ['', [Validators.maxLength(150)]],
      email: ['', [Validators.required, Validators.email]],
      mobile_number: ['', [Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],
      use_trial: [true]
    });
  }

  signup() {
  if (this.signupForm.invalid) {
    this.errorMessage = 'Please fill all required fields correctly.';
    return;
  }

  const formValue = this.signupForm.value;

  if (formValue.password !== formValue.confirm_password) {
    this.errorMessage = 'Passwords do not match.';
    return;
  }

  this.authService.signupMethod(formValue).subscribe({
    next: (res) => {
      console.log('Signup successful', res);
      this.toastService.success(res.message || 'Signup successful! Please log in.');
      this.router.navigate(['/login']);
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