import { Component, OnDestroy, OnInit } from '@angular/core';
import { DeliveryPartnerManifest, ManifestResponse, ManifestSkuWiseItem } from './manifest.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManifestService } from '../../services/manifest.service';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-manifest',
  standalone: true,
  imports: [CommonModule,
    FormsModule],
  templateUrl: './manifest.component.html',
  styleUrl: './manifest.component.scss'
})
export class ManifestComponent implements OnInit, OnDestroy {
  loading = false;

  // Filters
  selectedDate: string = '';   // ISO yyyy-MM-dd, bound to the <input type="date">
  search = '';

  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription = new Subscription();

  page = 1;
  limit = 100;

  // Summary
  manifestDate = '';
  totalQuantity = 0;
  deliveryPartnerCount = 0;
  totalRecords = 0;
  gotoPageNumber = 1;

  pageSizeOptions = [10, 20, 50, 100];

  // Cards
  manifestCards: DeliveryPartnerManifest[] = [];

  // SKU-wise summary
  skuWiseItems: ManifestSkuWiseItem[] = [];

  constructor(
    private manifestService: ManifestService
  ) { }

  ngOnInit(): void {

    // Default today's date (ISO format so the native date input displays it)
    this.selectedDate = this.toIsoDate(new Date());

    this.loadManifest();

    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((searchText) => {
        this.search = searchText;
        this.page = 1;
        this.loadManifest();
      });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  loadManifest(): void {

    this.loading = true;

    this.manifestService.getManifest({
      date: this.toApiDate(this.selectedDate),
      platform_code: 'MEESHO',
      search: this.search,
      page: this.page,
      limit: this.limit
    }).subscribe({

      next: (res: ManifestResponse) => {

        this.loading = false;

        this.manifestDate = res.manifest_date;
        this.totalQuantity = res.total_quantity || 0;
        this.deliveryPartnerCount = res.delivery_partner_count || 0;
        this.totalRecords = res.total_records || 0;

        this.manifestCards = res.data;
        this.skuWiseItems = res.sku_wise || [];
      },

      error: (err) => {

        this.loading = false;

        console.error(err);
      }

    });

  }

  onSearch(): void {
    this.searchSubject.next(this.search);
  }

  onDateChange(): void {
    this.page = 1;
    this.loadManifest();
  }

  refresh(): void {
    this.loadManifest();
  }

  nextPage(): void {

    this.page++;

    this.loadManifest();

  }
  onLimitChange() {
    this.page = 1;
    this.gotoPageNumber = 1;
    this.refresh(); // or your API method
  }

  goToPage(page: number) {

    const totalPages = Math.ceil(this.totalRecords / this.limit);

    if (page < 1 || page > totalPages) {
      return;
    }

    this.page = page;
    this.gotoPageNumber = page;

    this.refresh(); // or fetchManifest()

  }

  previousPage(): void {

    if (this.page > 1) {

      this.page--;

      this.loadManifest();

    }

  }

  get totalProducts(): number {

    return this.manifestCards.reduce(
      (sum, partner) => sum + partner.total_products,
      0
    );

  }

  trackByPartner(index: number, item: DeliveryPartnerManifest): string {
    return item.delivery_partner;
  }

  // yyyy-MM-dd — required for the native <input type="date"> to display a value
  private toIsoDate(date: Date): string {

    const year = date.getFullYear();

    const month = ('0' + (date.getMonth() + 1)).slice(-2);

    const day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;

  }

  // Converts the ISO date from the input back to dd-MM-yyyy for the API,
  // matching this endpoint's existing date format.
  private toApiDate(isoDate: string): string {

    if (!isoDate) {
      return isoDate;
    }

    const [year, month, day] = isoDate.split('-');

    return `${day}-${month}-${year}`;

  }

  get startRecord(): number {
    return this.totalRecords > 0 ? ((this.page - 1) * this.limit) + 1 : 0;
  }

  get endRecord(): number {
    return Math.min(this.page * this.limit, this.totalRecords);
  }

  getCourierColor(name: string): string {

    const colors: { [key: string]: string } = {

      'Ekart': '#7C3AED',
      'Blue Dart': '#2563EB',
      'Ecom Express': '#16A34A',
      'Valmo': '#0EA5E9',
      'Shadowfax': '#EC4899',
      'Delhivery': '#F97316',
      'Xpress Bees': '#DC2626'

    };

    return colors[name] || '#64748B';
  }
  get lastPage(): number {
    return Math.ceil(this.totalRecords / this.limit);
  }
}
