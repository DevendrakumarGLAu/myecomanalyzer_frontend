import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone:true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private isBrowser: boolean;

  constructor(
    private sidebarService: SidebarService,
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
}

toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
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


}