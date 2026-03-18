import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [NgFor, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {

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
    name: "Starter",
    price: "₹999/mo",
    features: [
      "Up to 500 orders",
      "2 Marketplaces",
      "Basic Profit Calculator"
    ]
  },
  {
    name: "Pro",
    price: "₹2499/mo",
    features: [
      "5000 orders",
      "All marketplaces",
      "PDF auto processing",
      "Advanced analytics"
    ]
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Unlimited orders",
      "Multi warehouse",
      "Custom integrations"
    ]
  }
];

}