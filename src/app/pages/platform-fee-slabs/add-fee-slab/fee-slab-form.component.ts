import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { PlatformFeeSlab } from '../../../services/platform-fee-slab.service';
import { PlatformService, Platform } from '../../../services/platform.service';
import { ToastService } from '../../../services/toast.service';

export interface FeeSlabDialogData {
  slab?: PlatformFeeSlab;
  mode: 'Add' | 'Update';
}

@Component({
  selector: 'app-fee-slab-form',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './fee-slab-form.component.html'
})
export class FeeSlabFormComponent implements OnInit {
  form: FormGroup;
  mode: 'Add' | 'Update';
  platforms: Platform[] = [];

  addingPlatform = false;
  newPlatformName = '';
  newPlatformCode = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FeeSlabFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FeeSlabDialogData,
    private platformService: PlatformService,
    private toast: ToastService
  ) {
    this.mode = data.mode;
    const s = data.slab;

    this.form = this.fb.group({
      platform_code: [s?.platform_code || '', Validators.required],
      category: [s?.category || 'ALL', Validators.required],
      min_selling_price: [s?.min_selling_price ?? 0, [Validators.required, Validators.min(0)]],
      max_selling_price: [s?.max_selling_price ?? null],
      commission_percent: [s?.commission_percent ?? 0, [Validators.required, Validators.min(0), Validators.max(100)]],
      fixed_fee: [s?.fixed_fee ?? 0, [Validators.required, Validators.min(0)]],
      shipping_fee: [s?.shipping_fee ?? 0, [Validators.required, Validators.min(0)]],
      rto_fee: [s?.rto_fee ?? 0, [Validators.required, Validators.min(0)]],
      gst_percent: [s?.gst_percent ?? 18, [Validators.required, Validators.min(0), Validators.max(100)]],
      effective_from: [s?.effective_from || new Date().toISOString().slice(0, 10), Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadPlatforms();
  }

  loadPlatforms(): void {
    this.platformService.getAllPlatforms().subscribe({
      next: (res: any) => this.platforms = res.data || [],
      error: (err) => console.error(err)
    });
  }

  toggleAddPlatform(): void {
    this.addingPlatform = !this.addingPlatform;
  }

  saveNewPlatform(): void {
    if (!this.newPlatformName.trim() || !this.newPlatformCode.trim()) {
      this.toast.error('Platform name and code are required');
      return;
    }

    this.platformService.addPlatform({
      name: this.newPlatformName.trim(),
      code: this.newPlatformCode.trim().toUpperCase()
    }).subscribe({
      next: (res: any) => {
        this.toast.success(res.message || 'Platform added');
        this.newPlatformName = '';
        this.newPlatformCode = '';
        this.addingPlatform = false;
        this.loadPlatforms();
      },
      error: (err) => this.toast.error(err?.error?.detail || 'Failed to add platform')
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
