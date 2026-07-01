import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ManifestResponse } from '../pages/manifest/manifest.model';


@Injectable({
  providedIn: 'root'
})
export class ManifestService {

  private apiUrl = `${environment.apiUrl}/api/v1/manifest`;

  constructor(private http: HttpClient) { }

  getManifest(
    filters: {
      date?: string;
      platform_code?: string;
      search?: string;
      page?: number;
      limit?: number;
    }
  ): Observable<ManifestResponse> {

    let params = new HttpParams();

    if (filters.date) {
      params = params.set('date', filters.date);
    }

    if (filters.platform_code) {
      params = params.set('platform_code', filters.platform_code);
    }

    if (filters.search) {
      params = params.set('search', filters.search);
    }

    params = params.set(
      'page',
      (filters.page ?? 1).toString()
    );

    params = params.set(
      'limit',
      (filters.limit ?? 100).toString()
    );

    return this.http.get<ManifestResponse>(
      `${this.apiUrl}/getall`,
      { params }
    );
  }
}