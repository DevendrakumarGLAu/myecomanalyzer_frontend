import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgFor, NgIf, NgClass, CommonModule } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service';
import { SIDEBAR_MENU, SidebarMenuItem } from '../sidebar-menu.config';
import { TitleCasePipe } from '../../pipes/title-case.pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, NgFor, NgIf, CommonModule, NgClass,TitleCasePipe],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  menuItems: SidebarMenuItem[] = SIDEBAR_MENU;
  openMenus: Record<number, boolean> = {};
  userName: string = '';
  userInitial:string ='';

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    const first = localStorage.getItem('first_name') || '';
  const last = localStorage.getItem('last_name') || '';

  this.userName = `${first} ${last}`.trim() || 'User';
this.userInitial = this.userName.charAt(0).toUpperCase();
    // On load, collapse sidebar for mobile screens
    if (window.innerWidth < 992) {
      this.sidebarService.setCollapsed(true);
    }

    this.sidebarService.collapsed$.subscribe((val) => {
      this.isCollapsed = val;
    });
  }

  // Optional: close sidebar when clicking outside on mobile
  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    if (window.innerWidth < 992 && !this.isCollapsed) {
      const sidebar = document.querySelector('.app-sidebar');
      const burgerBtn = document.querySelector('.app-header .nav-link[role="button"]');
      const target = event.target as Node;
      if (sidebar && !sidebar.contains(target) && !(burgerBtn && burgerBtn.contains(target))) {
        this.sidebarService.setCollapsed(true);
        document.body.classList.remove('sidebar-open');
      }
    }
  }

  toggleMenu(index: number) {
    this.openMenus[index] = !this.openMenus[index];
  }

  isMenuOpen(index: number): boolean {
    return !!this.openMenus[index];
  }
}
