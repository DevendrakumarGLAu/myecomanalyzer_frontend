import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface DashboardFilters {
  platform_code?: string;
  date_from?: string;       // YYYY-MM-DD
  date_to?: string;         // YYYY-MM-DD
  order_status?: string;    // e.g. DELIVERED, SHIPPED, RTO, CANCELLED
  delivery_partner?: string;
  min_order_amount?: number;
  max_order_amount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = `${environment.apiUrl}/api/v1`;

  constructor(private http: HttpClient) {}

  // Method to get dashboard summary with filters
  getDashboard(filters: DashboardFilters = {}) {
    let params = new HttpParams();

    if (filters.platform_code) {
      params = params.set('platform_code', filters.platform_code);
    }
    if (filters.date_from) {
      params = params.set('date_from', filters.date_from);
    }
    if (filters.date_to) {
      params = params.set('date_to', filters.date_to);
    }
    if (filters.order_status) {
      params = params.set('order_status', filters.order_status);
    }
    if (filters.delivery_partner) {
      params = params.set('delivery_partner', filters.delivery_partner);
    }
    if (filters.min_order_amount != null) {
      params = params.set('min_order_amount', filters.min_order_amount.toString());
    }
    if (filters.max_order_amount != null) {
      params = params.set('max_order_amount', filters.max_order_amount.toString());
    }

    return this.http.get(`${this.baseUrl}/dashboard/summary`, { params });
  }
}