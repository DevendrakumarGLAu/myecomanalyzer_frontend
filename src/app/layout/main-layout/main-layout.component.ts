import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { SidebarService } from '../../services/sidebar.service';
import { loadavg } from 'os';
import { LoaderComponent } from '../../common/loader/loader.component';
import { PageWrapperComponent } from '../pagelayout/page-wrapper.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    // LoaderComponent,
    PageWrapperComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  isSidebarCollapsed = false;

  constructor(private sidebarService: SidebarService) {
    this.sidebarService.collapsed$.subscribe(val => this.isSidebarCollapsed = val);
  }
}