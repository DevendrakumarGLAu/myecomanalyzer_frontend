import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationStateService ,Notification} from '../../services/notification-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private isBrowser: boolean;
  notifications: Notification[] = [];
  unreadCount = 0;
  loading = false;
  constructor(
    private sidebarService: SidebarService,
    private notificationService: NotificationStateService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  username = '';
  isDarkMode = false;
  createdAt = '';
  memberSince = '';

  ngOnInit() {
    if (!this.isBrowser) return;

    this.createdAt = localStorage.getItem('created_at') || '';
    if (this.createdAt) {
      const date = new Date(this.createdAt);
      this.memberSince = date.toLocaleString('en-US', {
        month: 'short',
        year: 'numeric'
      });
    }
    const firstName = localStorage.getItem('first_name') || '';
    const lastName = localStorage.getItem('last_name') || '';
    const fullName = `${firstName} ${lastName}`.trim();
    this.username = this.toTitleCase(fullName || localStorage.getItem('username') || 'User');
    this.loadNotifications();
  }

  toTitleCase(str: string): string {
    return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  }

  get userInitial(): string {
    return this.username?.charAt(0)?.toUpperCase() || 'U';
  }

  logout() {
    if (this.isBrowser) localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  ngAfterViewInit() {
    if (!this.isBrowser) return;
    this.isDarkMode = localStorage.getItem('dark_mode') === 'true';
    this.applyDarkModeClass();
  }

  toggleDarkMode() {
    if (!this.isBrowser) return;
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('dark_mode', String(this.isDarkMode));
    this.applyDarkModeClass();
  }

  private applyDarkModeClass() {
    if (!this.isBrowser) return;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  toggleSidebar(event?: Event) {
    // Stop propagation so the sidebar's document:click handler
    // doesn't immediately re-close the sidebar on mobile
    if (event) {
      event.stopPropagation();
    }
    if (this.isBrowser) {
      document.body.classList.toggle('sidebar-collapse');
      document.body.classList.toggle('sidebar-open');
    }
    this.sidebarService.toggle();
  }

  loadNotifications(): void {

    this.loading = true;

    this.notificationService
      .getNotifications(false)
      .subscribe({

        next: (response) => {

          this.notifications = response.notifications;

          this.unreadCount = this.notifications.filter(
            n => !n.is_read
          ).length;

          this.loading = false;
        },

        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  markAsRead(notification: Notification): void {

    if (notification.is_read) {
      return;
    }

    this.notificationService
      .markAsRead(notification.id)
      .subscribe({

        next: () => {

          notification.is_read = true;

          this.notifications =
            this.notifications.filter(
              n => n.id !== notification.id
            );

          this.unreadCount--;
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

          this.notifications = [];

          this.unreadCount = 0;
        },

        error: (err) => {
          console.error(err);
        }
      });
  }

  getNotificationIcon(type: string): string {

    switch (type) {

      case 'success':
        return 'bi-check-circle-fill text-success';

      case 'error':
        return 'bi-x-circle-fill text-danger';

      case 'info':
        return 'bi-info-circle-fill text-primary';

      default:
        return 'bi-bell-fill text-warning';
    }
  }

  timeAgo(date: string): string {

    const now = new Date().getTime();

    const created =
      new Date(date).getTime();

    const seconds =
      Math.floor((now - created) / 1000);

    if (seconds < 60) {
      return `${seconds}s ago`;
    }

    const minutes =
      Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours =
      Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days =
      Math.floor(hours / 24);

    return `${days}d ago`;
  }
}