import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { sanitizeFormValues } from '../../shared/form-sanitizer';
import { AuthService } from '../../services/auth.service';
import { PublicHeaderComponent } from '../../shared/public-header/public-header.component';
import { PublicFooterComponent } from '../../shared/public-footer/public-footer.component';

@Component({
  selector: 'app-login',
  standalone:true,
  imports:[ReactiveFormsModule, NgIf,RouterModule,PublicHeaderComponent, PublicFooterComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
   isLoading = false;
  errorMessage = '';
  showPassword = false;

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
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const sanitizedValue = sanitizeFormValues(this.loginForm.value, this.sanitizer);
    const { email, password } = sanitizedValue;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login success:', response);

        // Example: store token if backend returns it
        if (response?.access_token) {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('username', response.username || '');
          localStorage.setItem('first_name', response.first_name || '');
          localStorage.setItem('last_name', response.last_name || '');
          localStorage.setItem('created_at', response.created_at || '');
        }

        this.router.navigate(['/user-dashboard']);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'Invalid email or password';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}