import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable()
export class HtmlDecodeInterceptor implements HttpInterceptor {

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(

      map(event => {

        if (event instanceof HttpResponse) {

          return event.clone({
            body: this.decodeObject(event.body)
          });

        }

        return event;
      })

    );
  }

  private decodeHtml(value: string): string {

    const txt = document.createElement('textarea');

    txt.innerHTML = value;

    return txt.value;
  }

  private decodeObject(obj: any): any {

    if (typeof obj === 'string') {
      return this.decodeHtml(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.decodeObject(item));
    }

    if (obj !== null && typeof obj === 'object') {

      const decoded: any = {};

      Object.keys(obj).forEach(key => {
        decoded[key] = this.decodeObject(obj[key]);
      });

      return decoded;
    }

    return obj;
  }
}