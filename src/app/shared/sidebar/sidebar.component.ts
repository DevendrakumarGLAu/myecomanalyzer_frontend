import { Component, HostListener, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone:true,
  imports:[RouterModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;

  constructor(private sidebarService: SidebarService,
    
  ) {}

  ngOnInit() {
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
    if (window.innerWidth < 992 && this.isCollapsed) {
      const sidebar = document.querySelector('.app-sidebar');
      if (sidebar && !sidebar.contains(event.target as Node)) {
        this.sidebarService.setCollapsed(true); // keep collapsed unless toggle clicked
      }
    }
  }
}