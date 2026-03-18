// products.component.ts
import { Component, OnInit } from '@angular/core';
import { Product } from './product.model';
import { MatDialog } from '@angular/material/dialog';

import { ProductFormComponent } from './add-product-form/product-form.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../../../../material.module';
import { COLORS, PLATFORMS, PLATFORM_COLORS } from '../../common/constant/platform.constants';

declare var bootstrap: any;
@Component({
    selector: 'app-product',
    standalone: true,
    imports: [NgIf, NgFor, FormsModule, CommonModule, MaterialModule],
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
    searchTerm: string = '';
    products: Product[] = [];
    filteredProducts: Product[] = [];
    selectedProduct: Product | null = null;
    editingProduct = false;
    platformColors = PLATFORM_COLORS;
    colors = COLORS;
    platforms = PLATFORMS;
    selectedPlatform: string = '';

    // Dynamic columns config
    columns = [
        { key: 'sku', label: 'SKU', type: 'text' },
        { key: 'category_name', label: 'Category', type: 'text' },
        { key: 'name', label: 'Product Name', type: 'text', tooltip: true },
        { key: 'platform_code', label: 'Platform', type: 'platform' },
        { key: 'cost_price', label: 'Cost', type: 'currency' },
        { key: 'selling_price', label: 'Selling', type: 'currency' },
        { key: 'gst_percent', label: 'GST', type: 'percent' },
        { key: 'stock', label: 'Stock', type: 'stock' },
    ];

    constructor(private productService: ProductService,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        const filters = {
            search: this.searchTerm,
            platform: this.selectedPlatform,
            page: this.currentPage,
            limit: this.itemsPerPage
        };
        this.productService.getProducts(filters)
            .subscribe({
                next: (data) => {
                    this.products = data.items;
                    this.filteredProducts = data.items;
                    this.totalItems = data.total;
                },
                error: (err) => console.error(err)
            });
    }

    applyFilter(): void {
        const filters = {
            search: this.searchTerm,
            platform: this.selectedPlatform,
            page: this.currentPage,
            limit: this.itemsPerPage
        };

        this.productService.getProducts(filters).subscribe((data) => {
            this.filteredProducts = data.items;
            this.totalItems = data.total;
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        });
    }


    openDialog(product?: Product) {
        console.log("product", product)
        this.editingProduct = !!product;
        this.selectedProduct = product || null;
        const dialogRef = this.dialog.open(ProductFormComponent, {
            width: '3500px',
            data: {
                product: product || null,             // send product
                mode: this.editingProduct ? 'Update' : 'Add'  // send mode inside data
            },
            position: { top: '80px', bottom: '80px' },
            maxHeight: 'calc(100vh - 140px)'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.saveProduct(result);
            }
        });
    }

    closeDialog() {
        const modalEl = document.getElementById('productModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal?.hide();
    }

    saveProduct(product: Product) {
        if (this.editingProduct && this.selectedProduct?.id) {
            this.productService.updateProduct(Number(this.selectedProduct.id), product).subscribe({
                next: () => this.loadProducts(),
                complete: () => this.closeDialog()
            });
        } else {
            this.productService.addProduct(product).subscribe({
                next: () => this.loadProducts(),
                complete: () => this.closeDialog()
            });
        }
    }

    deleteProduct(product: Product) {
        let id = Number(product.id);
        if (confirm('Are you sure you want to delete this product?')) {
            this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
        }
    }

    deleteAll() {
        if (confirm('Are you sure you want to delete all products?')) {
            this.products = [];
            this.filteredProducts = [];
        }
    }

    getPlatformColor(platform: string): string {
        return this.platformColors[platform] || '#888888';
    }
    getPlatformName(code: string): string {
        const platform = this.platforms.find(p => p.code.toUpperCase() === code.toUpperCase());
        return platform ? platform.name : code;  // fallback to code if name not found
    }
    convertToNumber(value: string | number): number {
        return Number(value);
    }



    // Pagination variables
    totalItems = 0;
    itemsPerPage = 10;
    currentPage = 1;
    totalPages = 1;
    gotoPageNumber = 1;

    // Options for records per page
    pageSizeOptions = [5, 10, 20, 30, 50, 100];

    // Computed indexes
    get startIndex(): number {
        return (this.currentPage - 1) * this.itemsPerPage;
    }

    get endIndex(): number {
        return Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
    }

    // Generate page numbers array
    getPages(): number[] {
        const pages = [];
        for (let i = 1; i <= this.totalPages; i++) {
            pages.push(i);
        }
        return pages;
    }

    // Go to a specific page
    goToPage(page: number) {
        if (page < 1 || page > this.totalPages) return;

        this.currentPage = page;
        this.gotoPageNumber = page;

        // Reload data from backend
        this.loadProducts();
    }

    // Change page size
    onPageSizeChange() {
        this.currentPage = 1; // reset to first page
        this.gotoPageNumber = 1;
        this.updatePagination(this.totalItems);
        this.loadProducts();
    }

    // Update total pages after fetching data
    updatePagination(total: number) {
        this.totalItems = total;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    }
}