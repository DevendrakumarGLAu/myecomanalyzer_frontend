import { CommonModule, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { PLATFORMS } from '../../common/constant/platform.constants';

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


  constructor(private http: HttpClient,
    private invoiceService: InvoiceService
  ) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  errorList: any[] = [];
  errorFileUrl: string | null = null;
  uploadFile() {
    console.log("Selected Platform:", this.selectedPlatform);
    console.log("Selected File:", this.selectedFile);
    if (!this.selectedFile || !this.selectedPlatform) {
      this.message = "Please select platform and file.";
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
                `;

          // ✅ NEW: store detailed errors
          this.errorList = res?.data?.error_orders || [];
          this.errorFileUrl = res?.data?.error_file || null;
        },
        error: (err: any) => {
          this.message = 'Upload failed: ' + (err.error?.message || err.message);
        }
      });
  }
}

// 214662336226083456_1 - exchange order
