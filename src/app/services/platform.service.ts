import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Platform {
  id?: number;
  name: string;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  private baseUrl = `${environment.apiUrl}/api/v1/platforms`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    });
  }

  getAllPlatforms(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getall`, { headers: this.getHeaders() });
  }

  addPlatform(platform: Platform): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, platform, { headers: this.getHeaders() });
  }
}
