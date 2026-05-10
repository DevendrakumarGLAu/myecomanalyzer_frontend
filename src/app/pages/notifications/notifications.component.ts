import { Component, OnInit } from '@angular/core';
import {
  Notification,
  NotificationStateService as NotificationService
} from '../../services/notification-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notifications: Notification[] = [];

  unreadNotifications: Notification[] = [];

  readNotifications: Notification[] = [];

  activeTab: 'unread' | 'read' = 'unread';

  loading = false;

  // Pagination
  currentUnreadPage = 1;
  currentReadPage = 1;

  itemsPerPage = 5;

  constructor(
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {

    this.loading = true;

    this.notificationService
      .getNotifications(true)
      .subscribe({

        next: (response) => {

          this.notifications = response.notifications;

          this.unreadNotifications =
            this.notifications.filter(n => !n.is_read);

          this.readNotifications =
            this.notifications.filter(n => n.is_read);

          this.loading = false;
        },

        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  markAsRead(notification: Notification): void {

    this.notificationService
      .markAsRead(notification.id)
      .subscribe({

        next: () => {

          notification.is_read = true;

          this.unreadNotifications =
            this.unreadNotifications.filter(
              n => n.id !== notification.id
            );

          this.readNotifications.unshift(notification);
        },

        error: (err) => {
          console.error(err);
        }
      });
  }

  markAllAsRead(): void {

    this.notificationService
      .markAllAsRead()
      .subscribe({

        next: () => {

          this.readNotifications = [
            ...this.unreadNotifications.map(n => ({
              ...n,
              is_read: true
            })),
            ...this.readNotifications
          ];

          this.unreadNotifications = [];
        },

        error: (err) => {
          console.error(err);
        }
      });
  }

  // Badge color
  getBadgeClass(type: string): string {

    switch (type) {

      case 'success':
        return 'bg-success';

      case 'error':
        return 'bg-danger';

      case 'info':
        return 'bg-primary';

      default:
        return 'bg-secondary';
    }
  }

  // PAGINATION HELPERS

  get paginatedUnreadNotifications(): Notification[] {

    const start =
      (this.currentUnreadPage - 1) * this.itemsPerPage;

    const end =
      start + this.itemsPerPage;

    return this.unreadNotifications.slice(start, end);
  }

  get paginatedReadNotifications(): Notification[] {

    const start =
      (this.currentReadPage - 1) * this.itemsPerPage;

    const end =
      start + this.itemsPerPage;

    return this.readNotifications.slice(start, end);
  }

  get unreadTotalPages(): number {

    return Math.ceil(
      this.unreadNotifications.length / this.itemsPerPage
    );
  }

  get readTotalPages(): number {

    return Math.ceil(
      this.readNotifications.length / this.itemsPerPage
    );
  }

  changeUnreadPage(page: number): void {

    if (
      page >= 1 &&
      page <= this.unreadTotalPages
    ) {
      this.currentUnreadPage = page;
    }
  }

  changeReadPage(page: number): void {

    if (
      page >= 1 &&
      page <= this.readTotalPages
    ) {
      this.currentReadPage = page;
    }
  }
}