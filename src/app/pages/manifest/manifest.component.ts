import { Component } from '@angular/core';
import { DeliveryPartnerManifest, ManifestResponse } from './manifest.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManifestService } from '../../services/manifest.service';

@Component({
  selector: 'app-manifest',
  standalone: true,
  imports: [CommonModule,
    FormsModule],
  templateUrl: './manifest.component.html',
  styleUrl: './manifest.component.scss'
})
export class ManifestComponent {
  loading = false;

  // Filters
  selectedDate: string = '';
  search = '';

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

  constructor(
    private manifestService: ManifestService
  ) { }

  ngOnInit(): void {

    // Default today's date
    this.selectedDate = this.formatDate(new Date());

    this.loadManifest();
  }

  loadManifest(): void {

    this.loading = true;

    this.manifestService.getManifest({
      date: this.selectedDate,
      platform_code: 'MEESHO',
      search: this.search,
      page: this.page,
      limit: this.limit
    }).subscribe({

      next: (res: ManifestResponse) => {

        this.loading = false;

        this.manifestDate = res.manifest_date;
        this.totalQuantity = res.total_quantity;
        this.deliveryPartnerCount = res.delivery_partner_count;
        this.totalRecords = res.total_records;

        this.manifestCards = res.data;
      },

      error: (err) => {

        this.loading = false;

        console.error(err);
      }

    });

  }

  onSearch(): void {
    this.page = 1;
    this.loadManifest();
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

  private formatDate(date: Date): string {

    const year = date.getFullYear();

    const month = ('0' + (date.getMonth() + 1)).slice(-2);

    const day = ('0' + date.getDate()).slice(-2);

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
}
