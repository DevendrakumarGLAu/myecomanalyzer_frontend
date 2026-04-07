import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = `${environment.apiUrl}/api/v1`;

  constructor(private http: HttpClient) {}

  // Function to get headers with the access token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';  // get token from localStorage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'access-token': `Bearer ${token}` // use Authorization header to pass the token
    });
  }
   private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token') || '';
        return new HttpHeaders({
            'access-token': `Bearer ${token}` // <-- FastAPI standard
        });
    }

  // Method to get dashboard summary
  getDashboard(platformCode?: string) {
    platformCode = platformCode || 'meesho';  // Ensure platformCode is a string
    return this.http.get(`${this.baseUrl}/dashboard/summary${platformCode ? '?platform_code=' + platformCode : ''}`, {
      headers: this.getHeaders()  // Add token in the headers
    });
  }
}