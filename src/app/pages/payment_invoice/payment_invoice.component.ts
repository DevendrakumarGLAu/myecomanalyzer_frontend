import { CommonModule, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { PLATFORMS } from '../../common/constant/platform.constants';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-payment-invoice-upload',
  standalone: true,
  imports: [NgFor, FormsModule, CommonModule],
  templateUrl: './payment_invoice.component.html',
})
export class PaymentExcelComponent {

  selectedFile: File | null = null;
  selectedPlatform: string = '';

  platforms = PLATFORMS;

  message = '';

  // ✅ RESPONSE STATE
  responseData: any = null;
  skippedDetails: any[] = [];

  constructor(
    private http: HttpClient,
    private invoiceService: InvoiceService,
    private toast: ToastService
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    if (!allowedTypes.includes(file.type)) {
      this.message = "❌ Please upload a valid Excel file (.xlsx or .xls)";
      return;
    }

    this.selectedFile = file;
    this.message = '';
  }

  uploadFile() {
    if (!this.selectedFile || !this.selectedPlatform) {
      this.message = "Please select platform and file.";
      return;
    }

    this.invoiceService.uploadExcel(this.selectedFile, this.selectedPlatform)
      .subscribe({
        next: (res: any) => {

          // ✅ store full response
          this.responseData = res;
          this.skippedDetails = res?.skipped_details || [];

          this.message = res?.message || "Upload completed";
          this.toast.success(this.message);
        },
        error: (err: any) => {
          this.message = 'Upload failed: ' + (err.error?.detail || err.message);
          this.toast.error(this.message); 
        }
      });
  }
}