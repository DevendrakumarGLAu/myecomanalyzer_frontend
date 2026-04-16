import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Order {
  id: number;
  skuId: string;
  orderSubId: string;
  marketplace: string;
  status: string;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
   sku: string;
  marketplace: string;
  stock: number;
}
interface DeliveryPartnerStats {
  partner: string;
  total_orders: number;
  delivered: number;
  rto: number;
  cancelled: number;
  customer_return: number;
}
@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports:[NgFor,CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  deliveryPartners: any[] = [];

  // Example summary data
  summaries = [
    { icon: 'fas fa-dollar-sign', title: 'Revenue', value: '₹1,25,000', bg: '#10b77f' },
    { icon: 'fas fa-shopping-cart', title: 'Orders', value: '320', bg: '#0d6efd' },
    { icon: 'fas fa-boxes', title: 'Inventory', value: '1,250 SKUs', bg: '#ffc107' },
    { icon: 'fas fa-chart-line', title: 'Profit', value: '₹45,000', bg: '#6f42c1' }
  ];

  // Quick action features
  features = [
    { icon: 'fas fa-box', title: 'Product Master', desc: 'Manage SKUs across marketplaces' },
    { icon: 'fas fa-file-upload', title: 'PDF Dispatch Import', desc: 'Upload and parse invoices' },
    { icon: 'fas fa-barcode', title: 'Barcode Scanner', desc: 'Scan and update order status' },
    { icon: 'fas fa-chart-bar', title: 'Inventory Tracking', desc: 'Track real-time stock' },
    { icon: 'fas fa-chart-line', title: 'Profit Engine', desc: 'SKU-wise profit & loss' }
  ];

  // dashboard.component.ts

  recentOrders: Order[] = [
    { id: 1, skuId: 'SKU-001', orderSubId: 'ORD-2024-010', marketplace: 'Amazon', status: 'Delivered', quantity: 1 },
    { id: 2, skuId: 'SKU-002', orderSubId: 'ORD-2024-009', marketplace: 'Meesho', status: 'RTO', quantity: 2 },
    { id: 3, skuId: 'SKU-003', orderSubId: 'ORD-2024-008', marketplace: 'Flipkart', status: 'Dispatched', quantity: 1 },
  ];

  lowStockProducts: Product[] = [
    { id: 1, name: 'USB-C Hub', sku: 'SKU-001', marketplace: 'Amazon', stock: 5 },
    { id: 2, name: 'Cotton T-Shirt', sku: 'SKU-002', marketplace: 'Meesho', stock: 2 },
    { id: 3, name: 'Phone Case Premium', sku: 'SKU-003', marketplace: 'Flipkart', stock: 12 },
  ];

platformColors: Record<string, string> = {
    Amazon: 'bg-[hsl(35,100%,50%)]/10 text-[hsl(35,100%,40%)] border-[hsl(35,100%,50%)]/20',
    Meesho: 'bg-[hsl(330,70%,55%)]/10 text-[hsl(330,70%,50%)] border-[hsl(330,70%,55%)]/20',
    Flipkart: 'bg-[hsl(220,80%,55%)]/10 text-[hsl(220,80%,50%)] border-[hsl(220,80%,55%)]/20',
  };



 statusColors: Record<string, string> = {
    Delivered: 'bg-success/10 text-profit border-success/20',
    Dispatched: 'bg-[hsl(210,80%,55%)]/10 text-[hsl(210,80%,50%)] border-[hsl(210,80%,55%)]/20',
    RTO: 'bg-destructive/10 text-loss border-destructive/20',
    Cancelled: 'bg-muted text-muted-foreground border-border',
  };


  constructor() { }

  ngOnInit(): void { }

    getProductById(skuId: string): Product | undefined {
    return this.lowStockProducts.find(p => p.sku === skuId);
  }



}