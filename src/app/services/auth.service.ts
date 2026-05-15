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
    return this.http.post(
      `${this.apiUrl}/signup`,
      payload
    );
  }
}