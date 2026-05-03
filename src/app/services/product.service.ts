import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../pages/products/product.model';

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}
export function toHttpParams(params: Record<string, any>): { [param: string]: string } {
  const queryParams: { [param: string]: string } = {};
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== null && value !== undefined && value !== '') {
      queryParams[key] = value.toString(); // convert everything to string
    }
  });
  return queryParams;
}
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = `${environment.apiUrl}/api/v1/products`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    });
  }

  
getProducts(filters: Record<string, any>): Observable<any> {
  let params = new HttpParams();

  // Convert the filter object to query params
  Object.keys(filters).forEach(key => {
    const value = filters[key];
    if (value !== null && value !== undefined && value !== '') {
      params = params.set(key, value.toString());
    }
  });

  return this.http.get<any>(`${this.baseUrl}/getallproduct/`, {
    // headers: this.getHeaders(),
    params
  });
}

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/get/${id}`, { headers: this.getHeaders() });
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/add/`, product, { headers: this.getHeaders() });
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    // id is sent as query param
    return this.http.put<Product>(
      `${this.baseUrl}/update?id=${id}`,
      product,
      // { headers: this.getHeaders() }
    );
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deletebyId/${id}`, { headers: this.getHeaders() });
  }

  toggleActive(id: number): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/toggle_active/${id}`, {}, { headers: this.getHeaders() });
  }
}