import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from '../../../services/category.service';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { sanitizeFormValues } from '../../../shared/form-sanitizer';

export interface CategoryDialogData {
  category?: Category;
  mode: 'Add' | 'Update';
}

@Component({
  selector: 'app-category-form',
  standalone:true,
  imports:[ReactiveFormsModule],
  templateUrl: './category-form.component.html'
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  mode: 'Add' | 'Update';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryDialogData,
    private sanitizer: DomSanitizer
  ) {
    this.mode = data.mode;
    this.categoryForm = this.fb.group({
      name: [data.category?.name || '', Validators.required]
    });
  }

  ngOnInit(): void {}

  save(): void {
    if (this.categoryForm.valid) {
      const sanitizedValue = sanitizeFormValues(this.categoryForm.value, this.sanitizer);
      this.dialogRef.close(sanitizedValue);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}