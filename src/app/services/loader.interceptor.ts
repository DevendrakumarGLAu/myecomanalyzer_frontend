// loader.interceptor.ts
import { Injectable } from '@angular/core';
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
import { LoaderService } from './loader.service';
import { ToastService } from './toast.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(
    private loaderService: LoaderService,
    private router: Router,
    private toastService: ToastService
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

    // Auto-attach the token if available
    const token = localStorage.getItem('token');
    let authReq = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token || ''}`,
      },
    });
    
    // Remove the skip-loader header before sending to backend
    if (skipLoader) {
      authReq = authReq.clone({
        headers: authReq.headers.delete('X-Skip-Loader')
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid — clear auth and redirect
          this.loaderService.hide();
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('first_name');
          localStorage.removeItem('last_name');
          localStorage.removeItem('created_at');
          localStorage.removeItem('email');
          this.toastService.error('Session expired. Please log in again.');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      }),
      finalize(() => {
        this.loaderService.hide();
      })
    );
  }
}