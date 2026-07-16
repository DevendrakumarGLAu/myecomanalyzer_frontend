import { CommonModule, NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { PublicHeaderComponent } from '../../shared/public-header/public-header.component';
import { PublicFooterComponent } from '../../shared/public-footer/public-footer.component';

type ForgotPasswordStep = 'request' | 'verify' | 'success';
type ResetMethod = 'email' | 'mobile';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, NgIf, ReactiveFormsModule, RouterModule, PublicHeaderComponent, PublicFooterComponent],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent implements OnDestroy {
  step: ForgotPasswordStep = 'request';
  method: ResetMethod = 'email';
  isLoading = false;
  errorMessage = '';
  resendCooldown = 0;
  private resendTimer?: ReturnType<typeof setInterval>;

  requestForm: FormGroup;
  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {
    this.requestForm = this.fb.group({
      identifier: ['', [Validators.required, Validators.email]],
    });

    this.resetForm = this.fb.group({
      otp: ['', [Validators.required]],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  selectMethod(method: ResetMethod): void {
    if (this.method === method) {
      return;
    }
    this.method = method;
    this.errorMessage = '';

    const identifierControl = this.requestForm.get('identifier');
    identifierControl?.reset('');

    if (method === 'email') {
      identifierControl?.setValidators([Validators.required, Validators.email]);
    } else {
      identifierControl?.setValidators([Validators.required, Validators.pattern(/^[0-9]{10}$/)]);
    }
    identifierControl?.updateValueAndValidity();
  }

  sendOtp(): void {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService
      .forgotPassword({
        method: this.method,
        identifier: this.requestForm.value.identifier,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.step = 'verify';
          this.startResendCooldown();
          this.toast.success(`OTP sent to your ${this.method === 'email' ? 'email' : 'mobile number'}`);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.message || 'Unable to send OTP. Please try again.';
        },
      });
  }

  resendOtp(): void {
    if (this.resendCooldown > 0) {
      return;
    }
    this.sendOtp();
  }

  resetPasswordSubmit(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const { otp, new_password, confirm_password } = this.resetForm.value;

    if (new_password !== confirm_password) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService
      .resetPassword({
        method: this.method,
        identifier: this.requestForm.value.identifier,
        otp,
        new_password,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.step = 'success';
          this.clearResendCooldown();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error?.message || 'Invalid OTP or something went wrong.';
        },
      });
  }

  changeIdentifier(): void {
    this.step = 'request';
    this.errorMessage = '';
    this.resetForm.reset();
    this.clearResendCooldown();
  }

  private startResendCooldown(): void {
    this.clearResendCooldown();
    this.resendCooldown = 30;
    this.resendTimer = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        this.clearResendCooldown();
      }
    }, 1000);
  }

  private clearResendCooldown(): void {
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
      this.resendTimer = undefined;
    }
  }

  ngOnDestroy(): void {
    this.clearResendCooldown();
  }
}
