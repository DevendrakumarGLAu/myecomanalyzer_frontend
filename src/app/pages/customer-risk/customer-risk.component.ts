import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

import { CustomerRiskService, CustomerRiskRow } from '../../services/customer-risk.service';
import { CustomerRiskDetailComponent } from './customer-risk-detail/customer-risk-detail.component';

@Component({
  selector: 'app-customer-risk',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FormsModule],
  templateUrl: './customer-risk.component.html',
  styleUrls: ['./customer-risk.component.scss'],
})
export class CustomerRiskComponent implements OnInit, OnDestroy {
  customers: CustomerRiskRow[] = [];
  total = 0;
  loading = false;
  searchText = '';
  riskLevelFilter = '';

  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription = new Subscription();

  constructor(
    private customerRiskService: CustomerRiskService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadReport();

    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => this.loadReport());
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

  onSearch(): void {
    this.searchSubject.next(this.searchText);
  }

  loadReport(): void {
    this.loading = true;
    this.customerRiskService.getReport({
      search: this.searchText,
      risk_level: this.riskLevelFilter,
    }).subscribe({
      next: (res) => {
        this.customers = res.data;
        this.total = res.total;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  setRiskFilter(level: string): void {
    this.riskLevelFilter = level;
    this.loadReport();
  }

  openDetail(customerId: number): void {
    this.dialog.open(CustomerRiskDetailComponent, {
      width: '700px',
      maxHeight: 'calc(100vh - 140px)',
      data: { customerId }
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

  getRiskLabel(level: string): string {
    switch (level) {
      case 'HIGH_RISK': return 'High Risk';
      case 'MEDIUM_RISK': return 'Medium Risk';
      case 'LOW_RISK': return 'Low Risk';
      default: return 'New';
    }
  }
}
