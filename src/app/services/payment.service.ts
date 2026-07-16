import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface PaymentTrendFilters {
  range?: '7d' | '1m' | '1y' | 'custom';
  date_from?: string;       // YYYY-MM-DD, required only when range='custom'
  date_to?: string;         // YYYY-MM-DD, required only when range='custom'
  platform_code?: string;
}

export interface SkuProfitFilters {
  range?: '7d' | '1m' | '1y' | 'custom';  // omit for all-time
  date_from?: string;       // YYYY-MM-DD, for range='custom'
  date_to?: string;         // YYYY-MM-DD, for range='custom'
  platform_code?: string;
  sort?: 'profit_desc' | 'profit_asc' | 'revenue_desc';
  limit?: number;           // default 20, max 100
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl = `${environment.apiUrl}/api/v1`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getPaymentTrend(filters: PaymentTrendFilters = {}) {
    let params = new HttpParams();

    if (filters.range) {
      params = params.set('range', filters.range);
    }
    if (filters.date_from) {
      params = params.set('date_from', filters.date_from);
    }
    if (filters.date_to) {
      params = params.set('date_to', filters.date_to);
    }
    if (filters.platform_code) {
      params = params.set('platform_code', filters.platform_code);
    }

    const headers = new HttpHeaders({
      'X-Skip-Loader': 'true'
    });

    return this.http.get(`${this.baseUrl}/payments/trend`, { params, headers });
  }

  getSkuProfit(filters: SkuProfitFilters = {}) {
    let params = new HttpParams();

    if (filters.range) {
      params = params.set('range', filters.range);
    }
    if (filters.date_from) {
      params = params.set('date_from', filters.date_from);
    }
    if (filters.date_to) {
      params = params.set('date_to', filters.date_to);
    }
    if (filters.platform_code) {
      params = params.set('platform_code', filters.platform_code);
    }
    if (filters.sort) {
      params = params.set('sort', filters.sort);
    }
    if (filters.limit != null) {
      params = params.set('limit', filters.limit.toString());
    }

    const headers = new HttpHeaders({
      'X-Skip-Loader': 'true'
    });

    return this.http.get(`${this.baseUrl}/payments/sku-profit`, { params, headers });
  }
}
