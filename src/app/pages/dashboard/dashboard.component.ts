import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DashboardService, DashboardFilters } from '../../services/dashboard.service';
import { PaymentService, PaymentTrendFilters } from '../../services/payment.service';
import { CommonModule, isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { PLATFORMS, DELIVERY_PARTNERS, PLATFORM_COLORS } from '../../common/constant/platform.constants';
import { FormsModule } from '@angular/forms';
import { BarChartComponent } from '../../charts/bar-chart/bar-chart.component';

const SESSION_KEY = 'dashboard_filters';

const ORDER_STATUSES = [
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'RTO', value: 'RTO' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Ready to Ship', value: 'READY_TO_SHIP' },
  { label: 'Customer Return', value: 'CUSTOMER_RETURN' },
  { label: 'Pending', value: 'PENDING' },
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, CommonModule, BarChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class UserDashboardComponent implements OnInit {
  //  platforms = ['meesho', 'amazon', 'flipkart'];
  platformColors = PLATFORM_COLORS;
  dashboard: any;
  message: string = '';
  isLoading = false;

  // Filter options
  platforms = PLATFORMS;
  orderStatuses = ORDER_STATUSES;
  deliveryPartners = DELIVERY_PARTNERS;

  // Current filter values (bound to modal form)
  filters: DashboardFilters = {
    platform_code: 'MEESHO',
  };
chartFields = [
  'total_orders',
  'delivered_orders'
];

chartLabels = {
  total_orders: 'Total Orders',
  delivered_orders: 'Delivered Orders'
};

  // Tracks which filters are actively applied (for badges)
  appliedFilters: DashboardFilters = {};

  // Modal state
  isFilterOpen = false;

  // Payment trend
  paymentTrend: any;
  paymentRange: '7d' | '1m' | '1y' = '7d';
  isPaymentTrendLoading = false;
  paymentTrendError: string = '';

  private isBrowser: boolean;

  constructor(
    private dashboardService: DashboardService,
    private paymentService: PaymentService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
     console.log('Dashboard constructor', Date.now());
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.loadFiltersFromSession();
    if (this.isBrowser) {
      this.loadPaymentTrend();
    }
  }

  // ---- Session Storage ----
  loadFiltersFromSession() {
    console.log('loadFiltersFromSession');
    if (!this.isBrowser) return;
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      console.log('session found');
      try {
        const parsed = JSON.parse(saved);
        this.filters = { ...this.filters, ...parsed };
      } catch { }
    }
    this.appliedFilters = { ...this.filters };
    this.loadDashboard()
  }

  saveFiltersToSession() {
    if (!this.isBrowser) return;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(this.filters));
  }

  // ---- API ----
  loadDashboard() {
    console.log('loadDashboard', this.isBrowser ? 'BROWSER' : 'SERVER');
    this.isLoading = true;
    this.appliedFilters = { ...this.filters };
    this.saveFiltersToSession();

    this.dashboardService.getDashboard(this.filters).subscribe({
      next: (res: any) => {
        this.dashboard = res;
        this.isLoading = false;
      },
      error: () => {
        this.message = 'Failed to load dashboard data.';
        this.isLoading = false;
      },
    });
  }

  // ---- Payment Trend ----
  loadPaymentTrend() {
    this.isPaymentTrendLoading = true;
    this.paymentTrendError = '';

    const filters: PaymentTrendFilters = {
      range: this.paymentRange,
    };

    this.paymentService.getPaymentTrend(filters).subscribe({
      next: (res: any) => {
        this.paymentTrend = res.data;
        this.isPaymentTrendLoading = false;
      },
      error: () => {
        this.paymentTrendError = 'Failed to load payment trend.';
        this.isPaymentTrendLoading = false;
      },
    });
  }

  setPaymentRange(range: '7d' | '1m' | '1y') {
    this.paymentRange = range;
    this.loadPaymentTrend();
  }

  trackByIndex(index: number): number {
    return index;
  }
  getPlatformColor(platform: string): string {
    return this.platformColors[platform.toUpperCase()] || '#888888';
  }

  getStatusClass(code: string): string {
    const status = code?.toUpperCase();

    switch (status) {

      case 'DELIVERED':
        return 'green';

      case 'SHIPPED':
        return 'blue';

      case 'READY TO SHIP':
        return 'blue';

      case 'RTO COMPLETE':
        return 'yellow';

      case 'CUSTOMER RETURN':
        return 'yellow';

      case 'CANCELLED':
        return 'red';

      case 'LOST':
        return 'red';

      case 'DOOR STEP EXCHANGED':
        return 'indigo';

      default:
        return 'gray';
    }
  }
  // ---- Modal Controls ----
  openFilterModal() {
    // Copy applied filters into the form so the modal shows current state
    this.filters = { ...this.appliedFilters };
    this.isFilterOpen = true;
  }

  closeFilterModal() {
    this.isFilterOpen = false;
  }

  applyFilters() {
    this.isFilterOpen = false;
    this.loadDashboard();
  }

  resetFilters() {
    this.filters = { platform_code: 'MEESHO' };
    this.isFilterOpen = false;
    this.loadDashboard();
  }

  // ---- Active Filter Helpers ----
  getActiveFilterCount(): number {
    let count = 0;
    const f = this.appliedFilters;
    if (f.platform_code) count++;
    if (f.date_from) count++;
    if (f.date_to) count++;
    if (f.order_status) count++;
    if (f.delivery_partner) count++;
    if (f.min_order_amount != null && f.min_order_amount !== 0) count++;
    if (f.max_order_amount != null && f.max_order_amount !== 0) count++;
    return count;
  }

  getActiveFiltersList(): { label: string; value: string }[] {
    const list: { label: string; value: string }[] = [];
    const f = this.appliedFilters;

    if (f.platform_code) {
      const p = this.platforms.find((x) => x.code === f.platform_code);
      list.push({ label: 'Platform', value: p ? p.name : f.platform_code });
    }
    if (f.date_from) {
      list.push({ label: 'From', value: f.date_from });
    }
    if (f.date_to) {
      list.push({ label: 'To', value: f.date_to });
    }
    if (f.order_status) {
      const s = this.orderStatuses.find((x) => x.value === f.order_status);
      list.push({ label: 'Status', value: s ? s.label : f.order_status });
    }
    if (f.delivery_partner) {
      const d = this.deliveryPartners.find((x) => x.value === f.delivery_partner);
      list.push({ label: 'Partner', value: d ? d.label : f.delivery_partner });
    }
    if (f.min_order_amount != null && f.min_order_amount !== 0) {
      list.push({ label: 'Min ₹', value: f.min_order_amount.toString() });
    }
    if (f.max_order_amount != null && f.max_order_amount !== 0) {
      list.push({ label: 'Max ₹', value: f.max_order_amount.toString() });
    }
    return list;
  }

  removeFilter(label: string) {
    switch (label) {
      case 'Platform':
        this.appliedFilters.platform_code = undefined;
        break;
      case 'From':
        this.appliedFilters.date_from = undefined;
        break;
      case 'To':
        this.appliedFilters.date_to = undefined;
        break;
      case 'Status':
        this.appliedFilters.order_status = undefined;
        break;
      case 'Partner':
        this.appliedFilters.delivery_partner = undefined;
        break;
      case 'Min ₹':
        this.appliedFilters.min_order_amount = undefined;
        break;
      case 'Max ₹':
        this.appliedFilters.max_order_amount = undefined;
        break;
    }
    this.filters = { ...this.appliedFilters };
    this.loadDashboard();
  }

  getProfitCardClass(): string {
    const profit = this.dashboard?.summary?.total_profit;
    if (profit == null) {
      return 'bg-secondary';
    }
    return profit < 0 ? 'bg-danger' : 'bg-success';
  }
}
