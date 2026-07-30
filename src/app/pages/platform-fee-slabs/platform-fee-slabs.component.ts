import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { MaterialModule } from '../../../../material.module';
import { PlatformFeeSlabService, PlatformFeeSlab } from '../../services/platform-fee-slab.service';
import { PlatformService, Platform } from '../../services/platform.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmationPopupComponent } from '../../common/confirmation-popup/confirmation-popup.component';
import { FeeSlabFormComponent } from './add-fee-slab/fee-slab-form.component';

@Component({
  selector: 'app-platform-fee-slabs',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FormsModule, MaterialModule],
  templateUrl: './platform-fee-slabs.component.html',
  styleUrls: ['./platform-fee-slabs.component.scss'],
})
export class PlatformFeeSlabsComponent implements OnInit {
  slabs: (PlatformFeeSlab & { id: number; platform_name: string; is_active: boolean })[] = [];
  platforms: Platform[] = [];
  loading = false;

  selectedPlatformCode = '';
  showInactive = false;

  constructor(
    private dialog: MatDialog,
    private feeSlabService: PlatformFeeSlabService,
    private platformService: PlatformService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.loadPlatforms();
    this.loadSlabs();
  }

  loadPlatforms(): void {
    this.platformService.getAllPlatforms().subscribe({
      next: (res: any) => this.platforms = res.data || [],
      error: (err) => console.error(err)
    });
  }

  loadSlabs(): void {
    this.loading = true;
    const filters = {
      platform_code: this.selectedPlatformCode,
      include_inactive: this.showInactive
    };

    this.feeSlabService.getAll(filters).subscribe({
      next: (res: any) => {
        this.slabs = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  openDialog(slab?: any): void {
    const dialogRef = this.dialog.open(FeeSlabFormComponent, {
      width: '600px',
      data: {
        slab: slab || null,
        mode: slab ? 'Update' : 'Add',
      },
      position: { top: '80px', bottom: '80px' },
      maxHeight: 'calc(100vh - 140px)',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (slab) {
          this.updateSlab(slab.id, result);
        } else {
          this.addSlab(result);
        }
      }
    });
  }

  addSlab(data: PlatformFeeSlab): void {
    this.feeSlabService.add(data).subscribe({
      next: (res: any) => {
        this.toast.success(res.message || 'Fee slab created successfully');
        this.loadSlabs();
      },
      error: (err) => this.toast.error(err?.error?.detail || 'Failed to create fee slab')
    });
  }

  updateSlab(slabId: number, data: PlatformFeeSlab): void {
    this.feeSlabService.update(slabId, data).subscribe({
      next: (res: any) => {
        this.toast.success(res.message || 'Fee slab updated successfully');
        this.loadSlabs();
      },
      error: (err) => this.toast.error(err?.error?.detail || 'Failed to update fee slab')
    });
  }

  toggleActive(slab: any): void {
    this.feeSlabService.toggleActive(slab.id).subscribe({
      next: (res: any) => {
        this.toast.success(res?.message || 'Status updated');
        this.loadSlabs();
      },
      error: (err) => this.toast.error(err?.error?.detail || 'Failed to update status')
    });
  }

  deleteSlab(slab: any): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '380px',
      disableClose: true,
      panelClass: 'confirm-dialog-panel',
      data: {
        title: 'Confirm Delete',
        type: 'delete',
        message: `Delete fee slab for ${slab.platform_name} (${slab.category}, ₹${slab.min_selling_price}-${slab.max_selling_price ?? '∞'})?`,
        confirmButtonText: 'Delete'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.feeSlabService.delete(slab.id).subscribe({
          next: () => {
            this.toast.success('Fee slab deleted');
            this.loadSlabs();
          },
          error: (err) => this.toast.error(err?.error?.detail || 'Failed to delete fee slab')
        });
      }
    });
  }
}
