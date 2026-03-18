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
  templateUrl: './payment_invoice.component.html',
//   styleUrl: './invoice-upload.component.scss'
})
export class PaymentExcelComponent {
  selectedFile: File | null = null;
  selectedPlatform: string = '';
  message: string = '';
  platforms = PLATFORMS;


  constructor(private http: HttpClient,
    private invoiceService: InvoiceService
  ) { }

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
    console.log("Selected Platform:", this.selectedPlatform);
  console.log("Selected File:", this.selectedFile);
    if (!this.selectedFile || !this.selectedPlatform) {
      this.message = "Please select platform and file.";
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.invoiceService.uploadExcel(this.selectedFile, this.selectedPlatform)
      .subscribe({
        next: (res: any) => {
          const summary = res?.data?.summary;
          this.message = `
    ✅ Imported: ${summary.imported}
    🔁 Duplicate (Not Inserted): ${summary.duplicates}
    ❌ Error (Not Inserted): ${summary.errors}
    ⚠️ Total Not Inserted: ${summary.not_inserted}
  `;
        },
        error: (err: any) => {
          this.message = 'Upload failed: ' + (err.error?.message || err.message);
        }
      });
  }
}
