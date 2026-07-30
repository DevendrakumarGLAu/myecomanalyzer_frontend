import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PlatformFeeSlab {
  id?: number;
  platform_code: string;
  category: string;
  min_selling_price: number;
  max_selling_price: number | null;
  commission_percent: number;
  fixed_fee: number;
  shipping_fee: number;
  rto_fee: number;
  gst_percent: number;
  effective_from: string; // YYYY-MM-DD
}

@Injectable({
  providedIn: 'root'
})
export class PlatformFeeSlabService {
  private baseUrl = `${environment.apiUrl}/api/v1/platform-fee-slabs`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    });
  }

  getAll(filters: Record<string, any> = {}): Observable<any> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<any>(`${this.baseUrl}/getall`, { headers: this.getHeaders(), params });
  }

  add(slab: PlatformFeeSlab): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, slab, { headers: this.getHeaders() });
  }

  update(slabId: number, slab: PlatformFeeSlab): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${slabId}`, slab, { headers: this.getHeaders() });
  }

  toggleActive(slabId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/toggle_active/${slabId}`, {}, { headers: this.getHeaders() });
  }

  delete(slabId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${slabId}`, { headers: this.getHeaders() });
  }
}
