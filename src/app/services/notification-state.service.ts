import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  priority: string;
  is_read: boolean;
  created_at: string;
  product_id: number;
  order_id: number | null;
  data: any;
}

@Injectable({ providedIn: 'root' })
export class NotificationStateService {
  private dashboardBaseUrl = `${environment.apiUrl}/api/v1/dashboard`;
  private notificationsUrl = `${environment.apiUrl}/api/v1/dashboard/notifications`;

  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {}

   getNotifications(includeRead = false): Observable<any> {

    const params = new HttpParams()
      .set('platform_code', 'meesho')
      .set('include_read', includeRead);

    return this.http.get<any>(this.notificationsUrl, { params });
  }
   markAsRead(notificationId: number): Observable<any> {
    return this.http.put(
      `${this.notificationsUrl}/${notificationId}/read`,
      {}
    );
  }

  markAllAsRead(): Observable<any> {
    return this.http.put(
      `${this.notificationsUrl}/mark-all-read`,
      {}
    );
  }
}