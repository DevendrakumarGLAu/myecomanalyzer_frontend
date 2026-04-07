import { CommonModule, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-order-status-upload',
  standalone: true,
  imports: [NgFor, FormsModule, CommonModule],
  templateUrl: './order-status-upload.component.html',
  styleUrls: ['./order-status-upload.component.scss']
})
export class OrderStatusUploadComponent {
  selectedFile: File | null = null;
  message: string = '';
  errorList: any[] = [];
  notFoundList: any[] = [];

  constructor(private invoiceService: InvoiceService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (!this.selectedFile) {
      this.message = "Please select a CSV file.";
      return;
    }

    if (!this.selectedFile.name.toLowerCase().endsWith('.csv')) {
      this.message = "Only CSV files are allowed.";
      return;
    }

    this.invoiceService.uploadOrderStatusCSV(this.selectedFile, 'your_platform_code')
      .subscribe({
        next: (res: any) => {
          const summary = res?.data?.summary;

          this.message = `
            ✅ Total rows processed: ${summary.total}
            🔄 Updated: ${summary.updated}
            ⚠️ Errors: ${summary.errors}
            ❓ Not Found: ${summary.not_found}
          `;

          this.errorList = res?.data?.errors || [];
          this.notFoundList = res?.data?.not_found || [];
        },
        error: (err: any) => {
          this.message = 'Upload failed: ' + (err.error?.message || err.message);
          this.errorList = [];
          this.notFoundList = [];
        }
      });
  }
}