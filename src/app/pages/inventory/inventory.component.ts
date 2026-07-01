import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { PLATFORMS } from '../../common/constant/platform.constants';
import { ProductFormComponent } from '../products/add-product-form/product-form.component';
import { Product } from '../products/product.model';
import { ToastService } from '../../services/toast.service';
import { MatDialog } from '@angular/material/dialog';
declare var bootstrap: any;
@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  products: any[] = [];

  searchTerm = '';
  selectedPlatform = '';
  editingProduct = false;
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  platforms = PLATFORMS

  gotoPageNumber = 1;
  pageSizeOptions = [10, 20, 50, 100];

  columns = [
    { key: 'name', label: 'Product Name' },
    { key: 'sku', label: 'SKU' },
    { key: 'color', label: 'Color' },
    { key: 'stock', label: 'Stock' },
    { key: 'selling_price', label: 'Selling Price' }
  ];

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {

    const filters = {
      search: this.searchTerm,
      platform: this.selectedPlatform,
      page: this.currentPage,
      limit: this.itemsPerPage
    };

    this.productService.getProducts(filters).subscribe({
      next: (response: any) => {

        this.products = response.items || [];

        this.totalItems = response.total || 0;

        this.totalPages = Math.ceil(
          this.totalItems / this.itemsPerPage
        );

      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  applyFilter(): void {
    this.currentPage = 1;
    this.loadInventory();
  }

  goToPage(page: number): void {

    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
    this.gotoPageNumber = page;

    this.loadInventory();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadInventory();
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return Math.min(
      this.startIndex + this.itemsPerPage,
      this.totalItems
    );
  }

  getInventoryStatus(stock: number): string {

    if (stock === 0) {
      return 'Out Of Stock';
    }

    if (stock <= 11) {
      return 'Low Stock';
    }

    return 'In Stock';
  }

  getInventoryClass(stock: number): string {

    if (stock === 0) {
      return 'badge bg-danger';
    }

    if (stock <= 10) {
      return 'badge bg-warning text-dark';
    }

    return 'badge bg-success';
  }

  getVariantStock(product: any): number {

  if (!product?.variants || product.variants.length === 0) {
    return 0;
  }

  const stocks = product.variants
    .map((v: any) => Number(v.stock) || 0);

  return Math.min(...stocks);
}
  // getVariantStock(product: any): number {

  //   if (!product.variants?.length) {
  //     return 0;
  //   }

  //   return product.variants.reduce(
  //     (sum: number, variant: any) =>
  //       sum + (variant.stock || 0),
  //     0
  //   );
  // }

  getInventoryColor(stock: number): string {

  if (stock <= 0) {
    return '#EF4444';      // Red
  }

  if (stock < 30) {
    return '#F59E0B';      // Amber
  }

  return '#10B981';        // Green
}

// getInventoryStatus(stock: number): string {

//   if (stock <= 0) {
//     return 'Out of Stock';
//   }

//   if (stock < 30) {
//     return 'Low Stock';
//   }

//   return 'In Stock';
// }

  getSizes(product: any): string {

    if (!product.variants?.length) {
      return '-';
    }

    return product.variants
      .map((v: any) => v.size)
      .join(', ');
  }

  getColors(product: any): string {

    if (!product.variants?.length) {
      return '-';
    }

    return [...new Set(
      product.variants.map((v: any) => v.color)
    )].join(', ');
  }
  selectedProduct: Product | null = null;
  openDialog(product?: Product) {
    // console.log("product", product)
    this.editingProduct = !!product;
    this.selectedProduct = product || null;
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '1000px',
      maxHeight: '80vh',
      data: {
        product: product || null,             // send product
        mode: this.editingProduct ? 'Update' : 'Add'  // send mode inside data
      },
      position: { top: '80px', bottom: '80px' }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.saveProduct(result);
      }
    });
  }

  deleteProduct(product: Product) {
    let id = Number(product.id);
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => this.loadInventory());
    }
  }

  saveProduct(product: Product) {
    if (this.editingProduct && this.selectedProduct?.id) {
      this.productService.updateProduct(Number(this.selectedProduct.id), product)
        .subscribe({
          next: (res: any) => {
            this.toast.success(res?.message || 'Product updated successfully');
            this.loadInventory();
            this.closeDialog();
          },
          error: (err) => {
            this.toast.error(err?.error?.message || 'Failed to update product');
          }
        });

    } else {

      this.productService.addProduct(product)
        .subscribe({
          next: (res: any) => {
            this.toast.success(res?.message || 'Product added successfully');
            this.loadInventory();
            this.closeDialog();
          },
          error: (err) => {
            this.toast.error(err?.error?.message || 'Failed to add product');
          }
        });

    }
  }

  getLowestStockVariant(product: any): any {

    if (!product.variants?.length) {
      return null;
    }

    return product.variants.reduce((lowest: any, current: any) =>
      (current.stock || 0) < (lowest.stock || 0) ? current : lowest
    );
  }

  closeDialog() {
    const modalEl = document.getElementById('productModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
  }
}