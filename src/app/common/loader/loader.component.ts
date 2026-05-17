// loader.component.ts
import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-loader',
   standalone: true, // important if using standalone components
  imports: [NgIf,AsyncPipe], 
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
//   template: `
//     <div class="loader-overlay" *ngIf="loader.loading$ | async">
//       <div class="spinner"></div>
//     </div>
//   `,
//   styles: [`
//     .loader-overlay {
//       position: fixed;
//       top:0;
//       left:0;
//       width:100%;
//       height:100%;
//       background: rgba(0,0,0,0.3);
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       z-index: 9999;
//     }
//     .spinner {
//       border: 8px solid #f3f3f3;
//       border-top: 8px solid #3498db;
//       border-radius: 50%;
//       width: 60px;
//       height: 60px;
//       animation: spin 1s linear infinite;
//     }
//     @keyframes spin {
//       0% { transform: rotate(0deg); }
//       100% { transform: rotate(360deg); }
//     }
//   `]
})
export class LoaderComponent {
  constructor(public loader: LoaderService) {}
}