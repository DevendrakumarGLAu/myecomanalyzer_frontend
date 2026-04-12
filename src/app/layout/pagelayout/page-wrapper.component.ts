import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { BreadcrumbComponent } from '../breadcum/breadcrumb.component';

@Component({
  selector: 'app-page-wrapper',
  imports: [
      RouterOutlet,
        // BreadcrumbComponent
    ],
  template: `
  <!-- <app-breadcrumb></app-breadcrumb> -->
    <div class="app-page-wrapper overflow-auto">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./page-wrapper.component.scss']
})
export class PageWrapperComponent {}
