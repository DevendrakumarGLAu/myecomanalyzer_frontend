import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface HealthScoreFactor {
  score: number;
  weight_percent: number;
  detail: string;
}

export interface ProductHealthScore {
  product_id: number;
  product_name: string;
  health_score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  breakdown: {
    profit_margin: HealthScoreFactor;
    sales_volume: HealthScoreFactor;
    return_rate: HealthScoreFactor;
    inventory_availability: HealthScoreFactor;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductHealthScoreService {
  private baseUrl = `${environment.apiUrl}/api/v1/products/health-score`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    });
  }

  getAll(platformCode?: string, days: number = 90): Observable<{ data: ProductHealthScore[] }> {
    let params = new HttpParams().set('days', days.toString());
    if (platformCode) {
      params = params.set('platform_code', platformCode);
    }

    return this.http.get<{ data: ProductHealthScore[] }>(`${this.baseUrl}/getall`, {
      headers: this.getHeaders(),
      params
    });
  }
}
