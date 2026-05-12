// dispatch-invoice.component.ts

import { Component, OnDestroy, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { DatePipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { InvoiceUploadComponent } from '../invoice-upload/invoice-upload.component';
import { OrderStatusUploadComponent } from '../order_status_invoice_upload/order-status-upload.component';
import { PaymentExcelComponent } from '../payment_invoice/payment_invoice.component';
import { ManualDispatchComponent } from '../manual-dispatch/manual-dispatch.component';
declare var bootstrap: any;

@Component({
    selector: 'app-dispatch-invoice',
    standalone: true,
    imports: [NgIf, NgFor, TitleCasePipe, FormsModule,
        InvoiceUploadComponent,
        OrderStatusUploadComponent,
        PaymentExcelComponent, DatePipe,ManualDispatchComponent

    ],
    templateUrl: './dispatch-invoice.component.html',
    styleUrls: ['./dispatch-invoice.component.scss']
})
export class DispatchInvoiceComponent implements OnInit, OnDestroy {

    platforms = ['meesho', 'amazon', 'flipkart'];
    selectedPlatform = 'meesho';

    invoices: any[] = [];
    columns: string[] = [];

    page = 1;
    pageSizes = [5, 10, 15, 25, 50, 100];
    limit = 10;
    totalOrders = 0;

    loading = false;
    searchText = '';

    activeModal: string = '';
    modalTitle: string = '';
    private searchSubject = new Subject<string>();
    private searchSubscription: Subscription = new Subscription();
    constructor(private invoiceService: InvoiceService) { }

    ngOnInit() {
        this.fetchData();

        // ✅ Debounce search input
        this.searchSubscription = this.searchSubject
            .pipe(
                debounceTime(500), // wait 500ms after last input
                distinctUntilChanged()
            )
            .subscribe((searchText) => {
                this.searchText = searchText;
                this.page = 1; // reset page
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
    // ✅ API CALL
    fetchData() {
        this.loading = true;
        const params = {
            platform_code: this.selectedPlatform,
            page: this.page,
            limit: this.limit,
            search: this.searchText,
            sort_by: 'id',
            order: 'desc'

        }
        this.invoiceService
            .getAllOrdersData(this.selectedPlatform, this.page, this.limit, this.searchText)
            .subscribe({
                next: (res: any) => {
                    this.invoices = res.orders || [];
                    this.totalOrders = res.total_orders || 0;

                    // ✅ dynamic columns
                    if (this.invoices.length > 0) {
                        this.columns = Object.keys(this.invoices[0]);
                    }

                    this.loading = false;
                },
                error: (err) => {
                    console.error('API Error:', err);
                    this.loading = false;
                }
            });
    }

    // ✅ TAB CHANGE
    changeTab(platform: string) {
        if (this.selectedPlatform !== platform) {
            this.selectedPlatform = platform;
            this.page = 1;
            this.fetchData();
        }
    }

    // ✅ TOTAL PAGES (getter instead of variable)
    get totalPages(): number {
        return Math.ceil(this.totalOrders / this.limit) || 1;
    }

    // ✅ NEXT PAGE (FIXED)
    nextPage() {
        if (this.page < this.totalPages) {
            this.page++;
            this.fetchData();
        }
    }

    // ✅ PREVIOUS PAGE
    prevPage() {
        if (this.page > 1) {
            this.page--;
            this.fetchData();
        }
    }

    // ✅ GO TO PAGE INPUT
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

    // ✅ RECORD RANGE
    get startRecord(): number {
        return this.totalOrders === 0 ? 0 : (this.page - 1) * this.limit + 1;
    }

    get endRecord(): number {
        const end = this.page * this.limit;
        return end > this.totalOrders ? this.totalOrders : end;
    }

    onPageSizeChange(event: Event) {
        this.limit = Number((event.target as HTMLSelectElement).value);
        this.page = 1; // reset to first page
        this.fetchData();
    }

    openModal(type: string) {
        this.activeModal = type;
        if (type === 'invoice') this.modalTitle = 'Upload Invoice';
        if (type === 'excel') this.modalTitle = 'Upload Excel';
        if (type === 'status') this.modalTitle = 'Order Status';
        const modalEl = document.getElementById('mainModal');
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }
}