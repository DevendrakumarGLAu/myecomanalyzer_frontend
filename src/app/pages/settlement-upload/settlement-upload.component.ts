// settlement-upload.component.ts

import { Component, OnDestroy, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { PaymentService, PaymentTrendFilters, SkuProfitFilters } from '../../services/payment.service';
import { CommonModule, CurrencyPipe, DatePipe, NgClass, NgFor, NgIf, NgStyle, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { PaymentExcelComponent } from '../payment_invoice/payment_invoice.component';
import { BarChartComponent } from '../../charts/bar-chart/bar-chart.component';
import { PLATFORM_COLORS } from '../../common/constant/platform.constants';
declare var bootstrap: any;

type SkuProfitSort = 'profit_desc' | 'profit_asc' | 'revenue_desc';

@Component({
    selector: 'app-settlement-upload',
    standalone: true,
    imports: [NgIf, NgFor, TitleCasePipe, FormsModule, NgClass, NgStyle, CommonModule, DatePipe, CurrencyPipe, PaymentExcelComponent, BarChartComponent],
    templateUrl: './settlement-upload.component.html',
    styleUrls: ['./settlement-upload.component.scss']
})
export class SettlementUploadComponent implements OnInit, OnDestroy {

    platforms = ['meesho', 'amazon', 'flipkart'];
    selectedPlatform = 'meesho';
    platformColors = PLATFORM_COLORS;
    invoices: any[] = [];

    page = 1;
    pageSizes = [5, 10, 15, 25, 50, 100];
    limit = 10;
    totalOrders = 0;

    loading = false;
    searchText = '';

    // Payment trend
    paymentTrend: any;
    paymentRange: '7d' | '1m' | '1y' = '7d';
    isPaymentTrendLoading = false;
    paymentTrendError = '';

    // SKU-wise profit
    skuProfit: any;
    skuProfitSort: SkuProfitSort = 'profit_desc';
    skuProfitLimit = 20;
    skuProfitLoading = false;
    skuProfitError = '';
    skuProfitChartFields = ['profit'];
    skuProfitChartLabels = { profit: 'Profit (₹)' };

    private searchSubject = new Subject<string>();
    private searchSubscription: Subscription = new Subscription();

    constructor(
        private invoiceService: InvoiceService,
        private paymentService: PaymentService
    ) { }

    ngOnInit() {
        this.fetchData();
        this.loadPaymentTrend();
        this.loadSkuProfit();

        this.searchSubscription = this.searchSubject
            .pipe(
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe((searchText) => {
                this.searchText = searchText;
                this.page = 1;
                this.fetchData();
            });
    }

    ngOnDestroy() {
        if (this.searchSubscription) {
            this.searchSubscription.unsubscribe();
        }
    }

    onSearch() {
        this.searchSubject.next(this.searchText);
    }

    changeTab(platform: string) {
        if (this.selectedPlatform !== platform) {
            this.selectedPlatform = platform;
            this.page = 1;
            this.fetchData();
            this.loadPaymentTrend();
            this.loadSkuProfit();
        }
    }

    // ---- Payment Trend ----
    loadPaymentTrend() {
        this.isPaymentTrendLoading = true;
        this.paymentTrendError = '';

        const filters: PaymentTrendFilters = {
            range: this.paymentRange,
            platform_code: this.selectedPlatform,
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

    fetchData() {
        this.loading = true;
        this.invoiceService
            .getAllOrdersData(this.selectedPlatform, this.page, this.limit, this.searchText)
            .subscribe({
                next: (res: any) => {
                    this.invoices = res.orders || [];
                    this.totalOrders = res.total_orders || 0;
                    this.loading = false;
                },
                error: (err) => {
                    console.error('API Error:', err);
                    this.loading = false;
                }
            });
    }

    // ---- SKU-wise Profit ----
    loadSkuProfit() {
        this.skuProfitLoading = true;
        this.skuProfitError = '';

        const filters: SkuProfitFilters = {
            platform_code: this.selectedPlatform,
            sort: this.skuProfitSort,
            limit: this.skuProfitLimit,
        };

        this.paymentService.getSkuProfit(filters).subscribe({
            next: (res: any) => {
                this.skuProfit = res.data;
                this.skuProfitLoading = false;
            },
            error: () => {
                this.skuProfitError = 'Failed to load SKU-wise profit.';
                this.skuProfitLoading = false;
            },
        });
    }

    setSkuProfitSort(sort: SkuProfitSort) {
        this.skuProfitSort = sort;
        this.loadSkuProfit();
    }

    onSkuProfitLimitChange(event: Event) {
        this.skuProfitLimit = Number((event.target as HTMLSelectElement).value);
        this.loadSkuProfit();
    }

    openUploadModal() {
        const modalEl = document.getElementById('settlementUploadModal');
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }

    onSettlementUploaded() {
        const modalEl = document.getElementById('settlementUploadModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal?.hide();

        this.page = 1;
        this.fetchData();
        this.loadPaymentTrend();
        this.loadSkuProfit();
    }

    get totalPages(): number {
        return Math.ceil(this.totalOrders / this.limit) || 1;
    }

    nextPage() {
        if (this.page < this.totalPages) {
            this.page++;
            this.fetchData();
        }
    }

    prevPage() {
        if (this.page > 1) {
            this.page--;
            this.fetchData();
        }
    }

    goToPageInput(event: Event) {
        const pageNumber = Number((event.target as HTMLInputElement).value);

        if (!pageNumber || pageNumber < 1 || pageNumber > this.totalPages) {
            return;
        }

        if (pageNumber !== this.page) {
            this.page = pageNumber;
            this.fetchData();
        }
    }

    get startRecord(): number {
        return this.totalOrders === 0 ? 0 : (this.page - 1) * this.limit + 1;
    }

    get endRecord(): number {
        const end = this.page * this.limit;
        return end > this.totalOrders ? this.totalOrders : end;
    }

    onPageSizeChange(event: Event) {
        this.limit = Number((event.target as HTMLSelectElement).value);
        this.page = 1;
        this.fetchData();
    }

    getPlatformColor(platform: string): string {
        return this.platformColors[platform?.toUpperCase()] || '#888888';
    }

    getStatusClass(code: string): string {
        const status = code?.toUpperCase();

        switch (status) {
            case 'DELIVERED':
                return 'green';
            case 'READY_TO_SHIP':
                return 'blue';
            case 'RTO_COMPLETE':
                return 'yellow';
            case 'CUSTOMER_RETURN':
                return 'yellow';
            case 'CANCELLED':
                return 'red';
            case 'LOST':
                return 'red';
            case 'DOOR_STEP_EXCHANGED':
                return 'indigo';
            default:
                return 'gray';
        }
    }

    getColorStyle(color: string) {
        const hex = this.getColorHex(color);
        const upper = color?.toUpperCase();
        const isLight = ['WHITE', 'BEIGE', 'SILVER'].includes(upper);

        return {
            'background-color': isLight ? hex : hex + '33',
            'color': isLight ? '#111827' : hex,
            'border-color': hex
        };
    }

    getColorHex(color: string): string {
        const colors: Record<string, string> = {
            RED: '#ef4444',
            BLUE: '#3b82f6',
            GREEN: '#22c55e',
            BLACK: '#111827',
            WHITE: '#d1d5db',
            YELLOW: '#eab308',
            PINK: '#ec4899',
            PURPLE: '#8b5cf6',
            ORANGE: '#f97316',
            GREY: '#6b7280',
            GRAY: '#6b7280',
            BROWN: '#92400e',
            MAROON: '#800000',
            NAVY_BLUE: '#1e3a8a',
            SKY_BLUE: '#0ea5e9',
            BEIGE: '#d6c6a5',
            GOLD: '#ca8a04',
            SILVER: '#9ca3af',
            MULTICOLOR: '#7c3aed',
            OTHER: '#64748b'
        };

        return colors[color?.toUpperCase()] || '#64748b';
    }
}
