export interface ManifestItem {
  product_name: string;
  sku: string;
  size: string;
  color: string;
  quantity: number;
}

export interface DeliveryPartnerManifest {
  delivery_partner: string;
  total_quantity: number;
  total_products: number;
  items: ManifestItem[];
}

export interface ManifestSkuWiseItem {
  sku: string;
  product_name: string;
  size: string;
  color: string;
  quantity: number;
  delivery_partner_count: number;
}

export interface ManifestResponse {
  manifest_date: string;
  page: number;
  limit: number;
  total_records: number;
  delivery_partner_count: number;
  total_quantity: number;
  data: DeliveryPartnerManifest[];
  sku_wise: ManifestSkuWiseItem[];
}