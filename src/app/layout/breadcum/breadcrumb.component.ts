import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreadcrumbService } from '../../services/breadcrumb.service';
// import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { Observable } from 'rxjs';
import { Breadcrumb } from '../../services/breadcrumb.model';
// import { Breadcrumb } from '../../../core/services/breadcrumb.model';
// breadcrumb.model.ts

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink], // ✅ REQUIRED
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent {

  breadcrumbs$!: Observable<Breadcrumb[]>;

  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs;
  }
}
