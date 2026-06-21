import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {

  private baseUrl = `${environment.apiUrl}/api/v1/subscription_v1`;

  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
    });
  }

  constructor(private http: HttpClient) {}

//   private baseUrl = `${environment.apiUrl}/subscription_v1`;

getSubscription() {
  return this.http.get(`${this.baseUrl}/get`, {
    headers: this.getHeaders()
  });
}

addSubscription(plan: string) {
  return this.http.post(`${this.baseUrl}/add`, {
    plan
  }, {
    headers: this.getHeaders()
  });

}
}