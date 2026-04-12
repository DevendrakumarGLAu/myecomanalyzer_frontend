import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
  id?: number;
  name: string;
  is_active?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // private baseUrl = 'http://localhost:8000/categories'; // update your API URL
  private baseUrl = `${environment.apiUrl}/api/v1/categories`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'access-token': `Bearer ${token}`
    });
  }

  getAllCategories(filters: Record<string, any>): Observable<any> {
    let params = new HttpParams();

    // Convert the filter object to query params
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<any>(`${this.baseUrl}/getall/`, {
      headers: this.getHeaders(),
      params
    });

  }

  addCategory(category: Category): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/add`,
      category,
      { headers: this.getHeaders() }
    );
  }

  updateCategory(categoryId: number, category: Category): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/update?category_id=${categoryId}`,
      category,
      { headers: this.getHeaders() }
    );
  }

  deactivateCategory(categoryId: number): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/deactivate?category_id=${categoryId}`,
      {},
      { headers: this.getHeaders() }
    );
  }
}