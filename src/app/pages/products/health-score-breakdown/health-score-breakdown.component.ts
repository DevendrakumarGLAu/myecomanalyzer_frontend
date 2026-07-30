import { Component, Inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ProductHealthScore } from '../../../services/product-health-score.service';

export interface HealthScoreDialogData {
  score: ProductHealthScore;
}

@Component({
  selector: 'app-health-score-breakdown',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './health-score-breakdown.component.html'
})
export class HealthScoreBreakdownComponent {
  factors: { label: string; score: number; weight: number; detail: string }[];

  constructor(
    private dialogRef: MatDialogRef<HealthScoreBreakdownComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HealthScoreDialogData
  ) {
    const b = data.score.breakdown;
    this.factors = [
      { label: 'Profit Margin', score: b.profit_margin.score, weight: b.profit_margin.weight_percent, detail: b.profit_margin.detail },
      { label: 'Sales Volume', score: b.sales_volume.score, weight: b.sales_volume.weight_percent, detail: b.sales_volume.detail },
      { label: 'Return Rate', score: b.return_rate.score, weight: b.return_rate.weight_percent, detail: b.return_rate.detail },
      { label: 'Inventory Availability', score: b.inventory_availability.score, weight: b.inventory_availability.weight_percent, detail: b.inventory_availability.detail },
    ];
  }

  barColor(score: number): string {
    if (score >= 85) return '#198754';
    if (score >= 70) return '#0d6efd';
    if (score >= 55) return '#ffc107';
    if (score >= 40) return '#fd7e14';
    return '#dc3545';
  }

  close(): void {
    this.dialogRef.close();
  }
}
