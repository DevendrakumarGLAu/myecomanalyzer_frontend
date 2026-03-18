import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Category, CategoryService } from '../../services/category.service';
import { CategoryFormComponent } from './add-category/category-form.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { COLORS } from '../../common/constant/platform.constants';
import { MaterialModule } from '../../../../material.module';

@Component({
  selector: 'app-category',
  standalone:true,
  imports:[FormsModule,NgFor,NgIf,CommonModule,MaterialModule],
  templateUrl: './category.component.html',
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  total = 0;
  searchText = '';
  colors = COLORS;

  constructor(private dialog: MatDialog, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
     const filters = {
            search: this.searchText,
            page: this.currentPage,
            limit: this.itemsPerPage
        };
    this.categoryService.getAllCategories(filters).subscribe(
      (res: any) => {
        console.log("response category -",res)
        this.categories = res.data;
        this.total = res.total;
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
    this.categoryService.addCategory(data).subscribe(res => {
      alert(res.message);
      this.loadCategories();
    });
  }

  updateCategory(categoryId: any, data: any): void {
    this.categoryService.updateCategory(categoryId, data).subscribe(res => {
      alert(res.message);
      this.loadCategories();
    });
  }

  deactivateCategory(categoryId: any): void {
    if (confirm('Are you sure you want to deactivate this category?')) {
      this.categoryService.deactivateCategory(categoryId).subscribe(res => {
        alert(res.message);
        this.loadCategories();
      });
    }
  }
}