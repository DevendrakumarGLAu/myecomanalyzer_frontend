import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Profile {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private baseUrl = `${environment.apiUrl}/api/v1/profile`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    });
  }

  /**
   * Get profile details
   */
  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Update profile details
   */
  updateProfile(profile: Profile): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`,
      profile,
      { headers: this.getHeaders() }
    );
  }
}