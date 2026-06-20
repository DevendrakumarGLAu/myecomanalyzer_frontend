import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { ToastService } from '../../services/toast.service';

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
  duplicateOrders: any[] = [];
  fileError: string = '';

  constructor(private invoiceService: InvoiceService,
    private toast: ToastService
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['text/csv', 'application/csv', 'application/vnd.ms-excel'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['csv'];

      if (allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension)) {
        this.selectedFile = file;
        this.fileError = '';
      } else {
        this.selectedFile = null;
        this.fileError = 'Invalid file type. Please select a CSV file.';
        this.toast.error(this.fileError);
      }
    } else {
      this.selectedFile = null;
      this.fileError = '';
    }
  }

  uploadFile() {
    if (!this.selectedFile || this.fileError) {
      this.message = "Please select a valid CSV file.";
      this.toast.error(this.message);
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
          this.duplicateOrders = [];
          this.toast.error(this.message);
        }
      });
  }
}