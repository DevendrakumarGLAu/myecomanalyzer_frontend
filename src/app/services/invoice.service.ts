import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class InvoiceService {

    private baseUrl = `${environment.apiUrl}/api/v1/upload`;

    constructor(private http: HttpClient) { }

    // Get Authorization header with token
    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token') || '';
        return new HttpHeaders({
            'access-token': `Bearer ${token}` // <-- FastAPI standard
        });
    }

    uploadInvoice(file: File, platformCode: string): Observable<any> {
        const url = `${this.baseUrl}/upload-invoice/`;

        const formData = new FormData();
        formData.append('file', file);  // Must match backend param name

        const params = new HttpParams().set('platform_code', platformCode);

        // Do NOT set Content-Type manually for FormData
        return this.http.post(url, formData, { params, headers: this.getAuthHeaders() });
    }

    uploadExcel(file: File, platformCode: string): Observable<any> {
        const url = `${this.baseUrl}/upload-excel`;

        const formData = new FormData();
        formData.append('file', file);

        const params = new HttpParams().set('platform_code', platformCode);

        return this.http.post(url, formData, { params, headers: this.getAuthHeaders() });
    }

    uploadOrderStatusCSV(file: File, platformCode: string): Observable<any> {
        const url = `${this.baseUrl}/order-status`;

        const formData = new FormData();
        formData.append('file', file);

        const params = new HttpParams().set('platform_code', platformCode);

        return this.http.post(url, formData, { params, headers: this.getAuthHeaders() });
    }

    getAllOrdersData(platformCode: string, page: number, limit: number,search: string = ''): Observable<any> {
        let params = new HttpParams()
            .set('platform_code', platformCode)
            .set('page', page)
            .set('limit', limit)
            .set('search', search) // Placeholder for search text
            .set('sort_by', 'id')
            .set('order', 'desc');

        return this.http.get(`${this.baseUrl}/dispatch-invoice`, { params, headers: this.getAuthHeaders()});
    }
}