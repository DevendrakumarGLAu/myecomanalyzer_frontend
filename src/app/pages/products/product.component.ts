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
import { ToastService } from '../../services/toast.service';
import { ConfirmationPopupComponent } from '../../common/confirmation-popup/confirmation-popup.component';

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
    // Pagination variables
    totalItems = 0;
    itemsPerPage = 10;
    currentPage = 1;
    totalPages = 1;
    gotoPageNumber = 1;

    // Options for records per page
    pageSizeOptions = [5, 10, 20, 30, 50, 100];

    // Dynamic columns config
    columns = [
        { key: 'image', label: 'Image', type: 'image' },
        { key: 'sku', label: 'SKU', type: 'text',clickable: true },
        { key: 'category_name', label: 'Category', type: 'text' },
        { key: 'name', label: 'Product Name', type: 'text', tooltip: true },
        { key: 'platform_code', label: 'Platform', type: 'platform' },
        { key: 'cost_price', label: 'Cost', type: 'currency' },
        { key: 'selling_price', label: 'Selling', type: 'currency' },
        { key: 'gst_percent', label: 'GST', type: 'percent' },
        { key: 'stock', label: 'Stock', type: 'stock' },
    ];

    constructor(private productService: ProductService,
        private dialog: MatDialog, private toast: ToastService
    ) { }

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        const filters = {
            search: this.searchTerm.trim(),
            platform: this.selectedPlatform,
            page: this.currentPage,
            limit: Number(this.itemsPerPage)
        };
        this.productService.getProducts(filters)
            .subscribe({
                next: (data) => {
                    this.products = data.items;
                    this.filteredProducts = data.items;
                    this.updatePagination(data.total);
                },
                error: (err) => console.error(err)
            });
    }

    applyFilter(): void {
        this.currentPage = 1;
        this.gotoPageNumber = 1;
        this.loadProducts();
    }


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
            this.productService.updateProduct(Number(this.selectedProduct.id), product)
                .subscribe({
                    next: (res: any) => {
                        this.toast.success(res?.message || 'Product updated successfully');
                        this.loadProducts();
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
                        this.loadProducts();
                        this.closeDialog();
                    },
                    error: (err) => {
                        this.toast.error(err?.error?.message || 'Failed to add product');
                    }
                });

        }
    }

    // deleteProduct(product: Product) {
    //     let id = Number(product.id);
    //     if (confirm('Are you sure you want to delete this product?')) {
    //         this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
    //     }
    // }
    deleteProduct(product: Product) {
        const id = Number(product.id);

        const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
            width: '380px',
            disableClose: true,
            panelClass: 'confirm-dialog-panel',
            data: {
                title: 'Confirm Delete',
                type: 'delete',
                message: `Are you sure you want to delete?\nProduct: ${product.name}\nSKU: ${product.sku}`,
                confirmButtonText: 'Delete'
            }
        });

        dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
                this.productService.deleteProduct(id).subscribe(() => {
                    this.loadProducts();
                });
            }
        });
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


    // Computed indexes
    get startIndex(): number {
        if (this.totalItems === 0) return 0;
        return (this.currentPage - 1) * Number(this.itemsPerPage);
    }

    get endIndex(): number {
        return Math.min((this.currentPage - 1) * Number(this.itemsPerPage) + Number(this.itemsPerPage), this.totalItems);
    }

    // Generate page numbers array
    getPages(): number[] {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage: number, endPage: number;

        if (this.totalPages <= maxPagesToShow) {
            startPage = 1;
            endPage = this.totalPages;
        } else {
            const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
            const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;

            if (this.currentPage <= maxPagesBeforeCurrentPage) {
                startPage = 1;
                endPage = maxPagesToShow;
            } else if (this.currentPage + maxPagesAfterCurrentPage >= this.totalPages) {
                startPage = this.totalPages - maxPagesToShow + 1;
                endPage = this.totalPages;
            } else {
                startPage = this.currentPage - maxPagesBeforeCurrentPage;
                endPage = this.currentPage + maxPagesAfterCurrentPage;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
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
        this.totalPages = Math.ceil(this.totalItems / Number(this.itemsPerPage));
        if (this.totalPages === 0) {
            this.totalPages = 1;
        }
    }
}
