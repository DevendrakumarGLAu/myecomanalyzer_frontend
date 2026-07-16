import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-confirmation-popup',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './confirmation-popup.component.html',
  styleUrl: './confirmation-popup.component.scss'
})
export class ConfirmationPopupComponent {
  message: string | null = null;
  isChecked: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ConfirmationPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title?: string;
      message: string;
      confirmButtonText?: string;
      type?: string;
    }
  ) { }

  confirm() {
    if (!this.isChecked) return;
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
  getButtonClass(): string {
  let baseClass = '';

  switch (this.data?.type) {
    case 'delete':
      baseClass = 'btn btn-danger';
      break;

    case 'warning':
      baseClass = 'btn btn-warning';
      break;

    case 'success':
      baseClass = 'btn th-primary';
      break;

    default:
      baseClass = 'btn btn-primary';
  }

  // Clear, mutually-exclusive enabled/disabled look based on the checkbox
  baseClass += this.isChecked ? ' enabled' : ' disabled-state';

  return baseClass;
}
  
}
