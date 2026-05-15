// breadcrumb.service.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
// import { Breadcrumb } from './breadcrumb.model';
import { Breadcrumb } from './breadcrumb.model';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  

  private breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const root = this.router.routerState.snapshot.root;
        this.breadcrumbs$.next(this.buildBreadcrumbs(root));
      });
  }

  get breadcrumbs() {
    return this.breadcrumbs$.asObservable();
  }

  private buildBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {

    if (route.routeConfig && route.routeConfig.path) {
      url += `/${route.routeConfig.path}`;
    }

    if (route.data?.['breadcrumb']) {
      breadcrumbs.push({
        label: route.data['breadcrumb'],
        url
      });
    }

    if (route.firstChild) {
      return this.buildBreadcrumbs(route.firstChild, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
