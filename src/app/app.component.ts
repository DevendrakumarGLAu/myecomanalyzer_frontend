import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderService } from './services/loader.service';
import { LoaderComponent } from './common/loader/loader.component';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,LoaderComponent,NgIf,AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
   loading$!: Observable<boolean>;  // declare first

  constructor(private loaderService: LoaderService) {
    this.loading$ = this.loaderService.loading$;  // assign here
  }

  title = 'myecomanalyzer';
}
