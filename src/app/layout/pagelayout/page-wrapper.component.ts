import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatbotComponent } from '../../chatbot/chatbot.component';
import { BreadcrumbComponent } from '../breadcum/breadcrumb.component';

@Component({
  selector: 'app-page-wrapper',
  imports: [
      // RouterOutlet,
        BreadcrumbComponent,
        ChatbotComponent
    ],
  template: `
  <app-breadcrumb></app-breadcrumb>
    <div class="app-page-wrapper overflow-auto">
      <ng-content></ng-content>
      <!-- <router-outlet></router-outlet> -->
<app-chatbot></app-chatbot>

    </div>
  `,
  styleUrls: ['./page-wrapper.component.scss']
})
export class PageWrapperComponent {}
