import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  priority: string;
  is_read: boolean;
  created_at: string;
  product_id: number | null;
  order_id: number | null;
  action_url: string | null;
  data: any;
}

export interface NotificationListResponse {
  unread_count: number;
  notifications: Notification[];
}

@Injectable({ providedIn: 'root' })
export class NotificationStateService {
  private notificationsUrl = `${environment.apiUrl}/api/v1/dashboard/notifications`;

  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    });
  }

  getNotifications(includeRead = false, platformCode?: string): Observable<NotificationListResponse> {
    let params = new HttpParams().set('include_read', includeRead);
    if (platformCode) {
      params = params.set('platform_code', platformCode);
    }

    return this.http.get<NotificationListResponse>(this.notificationsUrl, { headers: this.getHeaders(), params })
      .pipe(tap(res => {
        this.notificationsSubject.next(res.notifications);
        this.unreadCountSubject.next(res.unread_count);
      }));
  }

  // Cheap poll target for the header badge — does not fetch/recompute the
  // full notification list.
  getUnreadCount(): Observable<{ unread_count: number }> {
    return this.http.get<{ unread_count: number }>(`${this.notificationsUrl}/unread-count`, { headers: this.getHeaders() })
      .pipe(tap(res => this.unreadCountSubject.next(res.unread_count)));
  }

  markAsRead(notificationId: number): Observable<any> {
    return this.http.put(
      `${this.notificationsUrl}/${notificationId}/read`,
      {},
      { headers: this.getHeaders() }
    ).pipe(tap(() => {
      const updated = this.notificationsSubject.value.map(n =>
        n.id === notificationId ? { ...n, is_read: true } : n
      );
      this.notificationsSubject.next(updated);
      this.unreadCountSubject.next(Math.max(0, this.unreadCountSubject.value - 1));
    }));
  }

  markAllAsRead(): Observable<any> {
    return this.http.put(
      `${this.notificationsUrl}/mark-all-read`,
      {},
      { headers: this.getHeaders() }
    ).pipe(tap(() => {
      const updated = this.notificationsSubject.value.map(n => ({ ...n, is_read: true }));
      this.notificationsSubject.next(updated);
      this.unreadCountSubject.next(0);
    }));
  }
}
