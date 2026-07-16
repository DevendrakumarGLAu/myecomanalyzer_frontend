import { isPlatformBrowser, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { sanitizeFormValues } from '../../shared/form-sanitizer';
import { AuthService, CaptchaResponse, LoginPayload } from '../../services/auth.service';
import { PublicHeaderComponent } from '../../shared/public-header/public-header.component';
import { PublicFooterComponent } from '../../shared/public-footer/public-footer.component';
import { inject, PLATFORM_ID } from '@angular/core';
@Component({
  selector: 'app-login',
  standalone:true,
  imports:[ReactiveFormsModule, NgIf,RouterModule,PublicHeaderComponent, PublicFooterComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);

  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  captchaId = '';
  captchaImageUrl: string | null = null;
  captchaExpiresIn = 0;
  captchaError = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      captchaAnswer: ['', Validators.required],
    });

    // this.loadCaptcha();
    if (isPlatformBrowser(this.platformId)) {
    this.loadCaptcha();
  }
  }

  loadCaptcha(): void {
    this.authService.generateCaptcha().subscribe({
      next: (captcha: CaptchaResponse) => {
        this.captchaId = captcha.captcha_id;
        this.captchaExpiresIn = captcha.expires_in;
        this.captchaImageUrl = captcha.captcha_image;
        this.captchaError = '';
      },
      error: (error) => {
        this.captchaError = 'Unable to load captcha. Please try again.';
      }
    });
  }

  refreshCaptcha(): void {
    this.loginForm.patchValue({ captchaAnswer: '' });
    this.loadCaptcha();
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    if (!this.captchaId) {
      this.captchaError = 'Please refresh the page to load captcha.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.captchaError = '';

    const sanitizedValue = sanitizeFormValues(this.loginForm.value, this.sanitizer);
    const payload: LoginPayload = {
      email: sanitizedValue.email,
      password: sanitizedValue.password,
      captcha_id: this.captchaId,
      captcha_answer: sanitizedValue.captchaAnswer,
    };

    this.authService.login(payload).subscribe({
      next: (response) => {
        console.log('Login success:', response);

        if (response?.access_token) {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('username', response.username || '');
          localStorage.setItem('first_name', response.first_name || '');
          localStorage.setItem('last_name', response.last_name || '');
        }

        this.router.navigate(['/user-dashboard']);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = error?.error?.detail || error?.error?.message || 'Login failed. Please check your credentials and try again.';
        this.captchaAnswerReset();
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  captchaAnswerReset(): void {
    const captchaControl = this.loginForm.get('captchaAnswer');
    captchaControl?.setValue('');
    // Avoid showing "Captcha answer is required" right after a failed
    // attempt — the errorMessage above already explains what went wrong.
    captchaControl?.markAsUntouched();
    this.loadCaptcha();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
