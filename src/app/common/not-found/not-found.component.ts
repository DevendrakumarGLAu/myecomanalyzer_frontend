import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent implements OnInit {
  attemptedUrl: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Get the current URL
    this.attemptedUrl = this.router.url;

    console.error('404 Error: User attempted to access non-existent route:', this.attemptedUrl);

    // Optional: Log each navigation to a non-existent route
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.attemptedUrl = event.url;
      }
    });
  }
}