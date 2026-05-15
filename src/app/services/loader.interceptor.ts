import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { LoaderService } from './loader.service';
import { ToastService } from './toast.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(
    private loaderService: LoaderService,
    private router: Router,
    private toastService: ToastService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // Skip loader if this is a chatbot request
    const skipLoader = req.headers.has('X-Skip-Loader');

    if (!skipLoader) {
      this.loaderService.show();
    }

    // SSR-safe token access
    let token: string | null = null;

    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token');
    }

    let authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token || ''}`,
      },
    });

    // Remove custom header before sending
    if (skipLoader) {
      authReq = authReq.clone({
        headers: authReq.headers.delete('X-Skip-Loader')
      });
    }

    return next.handle(authReq).pipe(

      catchError((error: HttpErrorResponse) => {

        if (error.status === 401) {

          this.loaderService.hide();

          // SSR-safe localStorage cleanup
          if (isPlatformBrowser(this.platformId)) {

            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('first_name');
            localStorage.removeItem('last_name');
            localStorage.removeItem('created_at');
            localStorage.removeItem('email');

            this.toastService.error(
              'Session expired. Please log in again.'
            );

            this.router.navigate(['/login']);
          }
        }

        return throwError(() => error);
      }),

      finalize(() => {
        this.loaderService.hide();
      })
    );
  }
}