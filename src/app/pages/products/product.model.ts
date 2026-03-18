
// models/product.model.ts

export type Marketplace = 'Amazon' | 'Flipkart' | 'Meesho';

export interface Product {
 id?: number;
  sku: string;
  name: string;
  catalog_id: number;
  category: string;
  color: string;
  size: string;
  marketplace: string;
  cost_price: number;
  selling_price: number;
  gst_percent: number;
  commission_percent: number;
  shipping_cost: number;
  rto_cost: number;
  stock: number;
  is_active: boolean;
   [key: string]: any;
}