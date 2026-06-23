import { CommonModule, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { PLATFORMS } from '../../common/constant/platform.constants';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-invoice-upload',
  standalone: true,
  imports: [NgFor, FormsModule, CommonModule],
  templateUrl: './invoice-upload.component.html',
  styleUrl: './invoice-upload.component.scss'
})
export class InvoiceUploadComponent {
  selectedFile: File | null = null;
  selectedPlatform: string = '';
  message: string = '';
  platforms = PLATFORMS;
  fileError: string = '';
  exchangeOrders: any[] = [];
  multiQuantityOrders: any[] = [];

  constructor(private http: HttpClient,
    private invoiceService: InvoiceService,
    private toast: ToastService
  ) { }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['pdf'];

      if (allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension)) {
        this.selectedFile = file;
        this.fileError = '';
      } else {
        this.selectedFile = null;
        this.fileError = 'Invalid file type. Please select a PDF or Excel file.';
        this.toast.error(this.fileError);
      }
    } else {
      this.selectedFile = null;
      this.fileError = '';
    }
  }
  errorList: any[] = [];
  errorFileUrl: string | null = null;
  duplicateOrders: any[] = [];
  uploadFile() {
    // console.log("Selected Platform:", this.selectedPlatform);
    // console.log("Selected File:", this.selectedFile);
    if (!this.selectedFile || !this.selectedPlatform || this.fileError) {
      this.message = "Please select platform and a valid file.";
      
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.invoiceService.uploadInvoice(this.selectedFile, this.selectedPlatform)
      .subscribe({
        next: (res: any) => {
          const summary = res?.data?.summary;

          this.message = `
          ✅ Imported: ${summary.imported}
          🔁 Duplicate: ${summary.duplicates}
          ❌ Errors: ${summary.errors}
          ⚠️ Not Inserted: ${summary.not_inserted}
          🔁 Exchange: ${summary.exchange_orders}
                `;

          // ✅ NEW: store detailed errors
          this.errorList = res?.data?.error_orders || [];
          this.errorFileUrl = res?.data?.error_file || null;
          this.duplicateOrders = res?.data?.duplicate_orders || [];
          this.exchangeOrders = res?.data?.exchange_orders || [];
          this.multiQuantityOrders = res?.data?.multi_quantity_orders || [];
  //         console.log("Duplicate Orders:", this.duplicateOrders);
  // console.log("Length:", this.duplicateOrders.length);
          this.toast.success(this.message);
        },
        error: (err: any) => {
          this.message =
            err?.error?.detail?.message ||
            err?.error?.message ||
            err.message ||
            'Upload failed';

          // Optional: show allowed file types
          if (err?.error?.detail?.details?.allowed_extensions) {
            const allowed = err.error.detail.details.allowed_extensions.join(', ');
            this.message += ` Allowed file types: ${allowed}`;
            this.toast.error(this.message);
          }
        }
      });
  }
}

// 214662336226083456_1 - exchange order
