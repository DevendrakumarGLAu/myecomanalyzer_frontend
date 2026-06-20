// confirm.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfirmService {

  private confirmSubject = new Subject<boolean>();
  confirm$ = this.confirmSubject.asObservable();

  private requestSubject = new Subject<string | null>();
  request$ = this.requestSubject.asObservable();

  open(message: string) {
    this.requestSubject.next(message);
    return this.confirm$;
  }

  resolve(result: boolean) {
    this.confirmSubject.next(result);
    this.confirmSubject.complete();
    this.confirmSubject = new Subject<boolean>(); // reset for next use
  }

  close() {
    this.requestSubject.next(null);
  }
}