import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CustomerRiskRow {
  customer_id: number;
  name: string;
  phone: string | null;
  state: string;
  pincode: string | null;
  total_orders: number;
  delivered_count: number;
  rto_count: number;
  return_count: number;
  return_rto_rate_percent: number;
  risk_level: 'NEW' | 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK';
  risk_reason: string;
  last_order_date: string | null;
}

export interface CustomerOrderHistoryRow {
  order_id: string;
  order_date: string;
  platform: string | null;
  product_name: string | null;
  sku: string | null;
  status: string | null;
  is_bad_outcome: boolean;
}

export interface CustomerRiskDetail extends Omit<CustomerRiskRow, 'phone' | 'delivered_count' | 'rto_count' | 'return_count' | 'last_order_date'> {
  address: string;
  phone: string | null;
  email: string | null;
  order_history: CustomerOrderHistoryRow[];
}

@Injectable({
  providedIn: 'root'
})
export class CustomerRiskService {
  private baseUrl = `${environment.apiUrl}/api/v1/customers/risk-report`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    });
  }

  getReport(filters: Record<string, any> = {}): Observable<{ total: number; data: CustomerRiskRow[] }> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<{ total: number; data: CustomerRiskRow[] }>(`${this.baseUrl}/getall`, {
      headers: this.getHeaders(),
      params
    });
  }

  getDetail(customerId: number): Observable<CustomerRiskDetail> {
    return this.http.get<CustomerRiskDetail>(`${this.baseUrl}/${customerId}`, { headers: this.getHeaders() });
  }
}
