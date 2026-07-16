import { isPlatformBrowser, NgClass, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicFooterComponent } from '../shared/public-footer/public-footer.component';
import { PublicHeaderComponent } from '../shared/public-header/public-header.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [NgFor, RouterModule, PublicHeaderComponent, PublicFooterComponent, NgClass,NgFor, NgIf],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements AfterViewInit {

  @ViewChild('demoVideo') demoVideoRef!: ElementRef<HTMLVideoElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const modalEl = document.getElementById('demoVideoModal');
    modalEl?.addEventListener('hidden.bs.modal', () => {
      const video = this.demoVideoRef?.nativeElement;
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }

features = [
  { icon: 'fas fa-box', title: 'Product Master', desc: 'Manage SKUs across Amazon, Flipkart & Meesho in one place' },
  { icon: 'fas fa-file-upload', title: 'PDF Dispatch Import', desc: 'Upload marketplace invoices and auto-extract orders instantly' },
  { icon: 'fas fa-barcode', title: 'Barcode Scanner', desc: 'Scan barcodes to mark orders as Dispatched, RTO, or Cancelled' },
  { icon: 'fas fa-chart-bar', title: 'Inventory Tracking', desc: 'Real-time stock levels with auto-reduce on dispatch & return adjust' },
  { icon: 'fas fa-chart-line', title: 'Profit Engine', desc: 'SKU-wise P&L with GST, commission, shipping & RTO factored in' },
  { icon: 'fas fa-sync', title: 'Return Management', desc: 'Track RTO and customer returns automatically' }
];

plans = [
  {
    name: "Basic",
    price: "₹199",
    period: "/month",
    badge: "",
    button: "Start Basic",
    popular: false,
    features: [
      "1 Marketplace Integration",
      "1000 Orders / Month",
      "Settlement Excel Upload",
      "Dispatch PDF Parsing",
      "Profit Calculation",
      "Basic Analytics",
      "Email Support",
      "No Hidden Charges"
    ]
  },
  {
    name: "Growth",
    price: "₹399",
    period: "/month",
    badge: "Most Popular",
    button: "Start Growth",
    popular: true,
    features: [
      "2 Marketplace Integrations",
      "3000 Orders / Month",
      "Advanced Profit Analytics",
      "Return & RTO Tracking",
      "Marketplace Fee Breakdown",
      "Priority Support",
      "Fast Processing",
      "Export Reports"
    ]
  },
  {
    name: "Pro",
    price: "₹799",
    period: "/month",
    badge: "",
    button: "Start Pro",
    popular: false,
    features: [
      "5 Marketplace Integrations",
      "10000 Orders / Month",
      "AI Profit Insights",
      "Team Access",
      "Custom Reports",
      "Advanced Dashboard",
      "Premium Support",
      "API Access"
    ]
  }
];

}