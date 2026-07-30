import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { CustomerRiskService, CustomerRiskDetail } from '../../../services/customer-risk.service';

export interface CustomerRiskDetailDialogData {
  customerId: number;
}

@Component({
  selector: 'app-customer-risk-detail',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './customer-risk-detail.component.html'
})
export class CustomerRiskDetailComponent implements OnInit {
  detail: CustomerRiskDetail | null = null;
  loading = true;

  constructor(
    private dialogRef: MatDialogRef<CustomerRiskDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CustomerRiskDetailDialogData,
    private customerRiskService: CustomerRiskService
  ) { }

  ngOnInit(): void {
    this.customerRiskService.getDetail(this.data.customerId).subscribe({
      next: (res) => {
        this.detail = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  getRiskBadgeClass(level: string): string {
    switch (level) {
      case 'HIGH_RISK': return 'bg-danger';
      case 'MEDIUM_RISK': return 'bg-warning text-dark';
      case 'LOW_RISK': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
