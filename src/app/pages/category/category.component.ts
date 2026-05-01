import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Category, CategoryService } from '../../services/category.service';
import { CategoryFormComponent } from './add-category/category-form.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { COLORS } from '../../common/constant/platform.constants';
import { MaterialModule } from '../../../../material.module';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, CommonModule, MaterialModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  total = 0;
  searchText = '';
  colors = COLORS;
  page = 1;
  limit = 10;
  totalPages = 0;

  pageSizes = [5, 10, 20, 50];

  startRecord = 0;
  endRecord = 0;

  constructor(private dialog: MatDialog, private categoryService: CategoryService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    const filters = {
      search: this.searchText,
      page: this.page,
      limit: this.limit
    };

    this.categoryService.getAllCategories(filters).subscribe(
      (res: any) => {
        console.log("response category -", res);


        this.categories = res.data || [];
        this.total = res.total || 0;

        // Calculate total pages
        this.totalPages = Math.ceil(this.total / this.limit);

        // Record range
        this.startRecord = this.total === 0 ? 0 : (this.page - 1) * this.limit + 1;
        this.endRecord = Math.min(this.page * this.limit, this.total);
      },
      err => console.error(err)
    );
  }

  openDialog(category?: Category): void {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      width: '600px',
      data: {
        category: category || null,
        mode: category ? 'Update' : 'Add',
      },
      position: { top: '80px', bottom: '80px' },
      maxHeight: 'calc(100vh - 140px)',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // result contains category form data
        if (category) {
          this.updateCategory(category.id!, result);
        } else {
          this.addCategory(result);
        }
      }
    });
  }

 addCategory(data: any): void {
  this.categoryService.addCategory(data).subscribe({
    next: (res: any) => {
      this.toast.success(res.message || 'Category added successfully');
      this.loadCategories();
    },
    error: (err) => {
      this.toast.error(err?.error?.message || 'Failed to add category');
    }
  });
}

updateCategory(categoryId: any, data: any): void {
  this.categoryService.updateCategory(categoryId, data).subscribe({
    next: (res: any) => {
      console.log("response category", res);

      this.toast.success(res.message || 'Category updated successfully');
      this.loadCategories();
    },
    error: (err) => {
      this.toast.error(err?.error?.message || 'Failed to update category');
    }
  });
}

  deactivateCategory(categoryId: any): void {
    if (confirm('Are you sure you want to deactivate this category?')) {
      this.categoryService.deactivateCategory(categoryId).subscribe(res => {
        this.loadCategories();
      });
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadCategories();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadCategories();
    }
  }

  goToPageInput(event: any): void {
    const value = Number(event.target.value);

    if (value >= 1 && value <= this.totalPages) {
      this.page = value;
      this.loadCategories();
    }
  }

  onPageSizeChange(event: any): void {
    this.limit = Number(event.target.value);
    this.page = 1; // reset to first page
    this.loadCategories();
  }
}