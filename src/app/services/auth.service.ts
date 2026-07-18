import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginPayload {
  email: string;
  password: string;
  captcha_id: string;
  captcha_answer: string;
}

export interface CaptchaResponse {
  captcha_id: string;
  captcha_image: string;
  expires_in: number;
}

export interface ForgotPasswordPayload {
  method: 'email' | 'mobile';
  identifier: string;
}

export interface ResetPasswordPayload {
  method: 'email' | 'mobile';
  identifier: string;
  otp: string;
  new_password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/api/v1`;

  constructor(private http: HttpClient) {}

  login(payload: LoginPayload): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/auth/login`,
      payload
    );
  }

  generateCaptcha(): Observable<CaptchaResponse> {
    return this.http.post<CaptchaResponse>(
      `${this.apiUrl}/auth/captcha/generate`,
      {}
    );
  }

  verifyCaptcha(captchaId: string, answer: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/auth/captcha/verify`,
      { captcha_id: captchaId, answer }
    );
  }

  validateCaptcha(captchaId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/auth/captcha/validate`,
      { captcha_id: captchaId }
    );
  }

  signupMethod(payload: any): Observable<any> {
    // /signup (legacy) is gone — it bypassed password policy, CAPTCHA, and
    // rate limiting entirely. /auth/signup is the hardened replacement, but
    // it expects `password_confirm`, not `confirm_password`, and returns
    // access/refresh tokens directly (no separate login step needed after).
    const { confirm_password, ...rest } = payload;
    const body = { ...rest, password_confirm: confirm_password };

    return this.http.post(
      `${this.apiUrl}/auth/signup`,
      body
    );
  }

  // NOTE: endpoint paths/payloads are placeholders — confirm against the real
  // backend contract and adjust once forgot/reset-password APIs exist.
  forgotPassword(payload: ForgotPasswordPayload): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/auth/forgot-password`,
      payload
    );
  }

  resetPassword(payload: ResetPasswordPayload): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/auth/reset-password`,
      payload
    );
  }
}