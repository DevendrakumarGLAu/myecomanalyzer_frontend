import { Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  constructor(private sidebarService: SidebarService,
    private router:Router
  ) {}

  username = '';
createdAt = '';
memberSince = '';

ngOnInit() {
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
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    document.body.classList.toggle('sidebar-collapse');
    this.sidebarService.toggle();
  }


}