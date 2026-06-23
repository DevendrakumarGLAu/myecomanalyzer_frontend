import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../product.model';
import { PLATFORMS, COLORS } from '../../../common/constant/platform.constants';
import { CategoryService } from '../../../services/category.service';
import { firstValueFrom } from 'rxjs';
import { sanitizeFormValues } from '../../../shared/form-sanitizer';
import { ConfirmationPopupComponent } from '../../../common/confirmation-popup/confirmation-popup.component';

export interface ProductField {
  key: string;
  label: string;
  type: string;
  options?: any[];
  placeholder: string;
}

interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit, OnChanges {
  @Input() productData: any = null;
  // platforms = PLATFORMS;
  colors = COLORS;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  form!: FormGroup;
  mode: 'Add' | 'Update' = 'Add';
  fields: ProductField[] = [
    { key: 'sku', label: 'SKU Code', type: 'text', placeholder: "Enter Sku " },
    { key: 'category_id', label: 'Category', type: 'select', placeholder: 'Select Category', options: [] },
    { key: 'catalog_id', label: 'Catalog Id', type: 'number', placeholder: "Enter Catalog Id " },
    { key: 'color', label: 'Color', type: 'select', placeholder: "Select Color", options: [] },
    { key: 'name', label: 'Product Name', type: 'text', placeholder: "Enter Product Name " },
    { key: 'platform_code', label: 'Platforms', type: 'select', placeholder: "", options: [] },
    { key: 'cost_price', label: 'Cost Price', type: 'number', placeholder: "Enter Cost Price " },
    { key: 'selling_price', label: 'Selling Price', type: 'number', placeholder: "Enter Selling Price " },
    { key: 'gst_percent', label: 'GST %', type: 'number', placeholder: "Enter GST % " },
    { key: 'commission_percent', label: 'Commission %', type: 'number', placeholder: "Enter commission " },
    { key: 'shipping_cost', label: 'Shipping Cost', type: 'number', placeholder: "Enter Shipping Cost " },
    { key: 'rto_cost', label: 'RTO Cost', type: 'number', placeholder: "Enter RTO Cost " },
    { key: 'stock', label: 'Stock', type: 'number', placeholder: "Enter Stock " },
    { key: 'size', label: 'Size', type: 'text', placeholder: `"Enter Size like L,M,S "` },

  ];
  PLATFORMS: SelectOption[] = [
    { label: 'Flipkart', value: 'FLIPKART' },
    { label: 'Meesho', value: 'MEESHO' },
    { label: 'Amazon', value: 'AMAZON' },
  ];

  colors1 = [
    { "label": "Red", "value": "RED" },
    { "label": "Blue", "value": "BLUE" },
    { "label": "Green", "value": "GREEN" },
    { "label": "Black", "value": "BLACK" },
    { "label": "White", "value": "WHITE" },
    { "label": "Yellow", "value": "YELLOW" },
    { "label": "Pink", "value": "PINK" },
    { "label": "Purple", "value": "PURPLE" },
    { "label": "Orange", "value": "ORANGE" },
    { "label": "Grey", "value": "GREY" },
    { "label": "Brown", "value": "BROWN" },
    { "label": "Maroon", "value": "MAROON" },
    { "label": "Navy Blue", "value": "NAVY_BLUE" },
    { "label": "Sky Blue", "value": "SKY_BLUE" },
    { "label": "Beige", "value": "BEIGE" },
    { "label": "Gold", "value": "GOLD" },
    { "label": "Silver", "value": "SILVER" },
    { "label": "Multicolor", "value": "MULTICOLOR" },
    { "label": "Other", "value": "OTHER" }
  ]

  constructor(
    private fb: FormBuilder,
    private categoryservice: CategoryService,
    public dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product | null,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.productData = this.data?.['product'] ?? null;
    this.mode = this.data?.['mode'] ?? 'add';
    this.populateplatformOptions();
    this.populateColorOptions();
    this.fetchCategories()
    this.initForm();
    if (this.productData) {
      this.patchProduct(this.productData);
    }
  }
  get isEditMode(): boolean {
    return !!this.productData; // true if productData exists
  }
  patchProduct(product: any) {

    const variant = product?.variants?.[0] || {};

    this.form.patchValue({
      sku: variant.sku || '',
      catalog_id: product.catalog_id,
      name: product.name,
      category_id: product.category_id,
      color: variant.color || '',
      platform_code: product.platform_code || '',
      gst_percent: product.gst_percent,
      commission_percent: product.commission_percent
    });

    this.variantsArray.clear();

    if (product.variants?.length) {
      product.variants.forEach((v: any) => {
        this.variantsArray.push(
          this.fb.group({
            id: [v.id],
            size: [v.size || ''],
            cost_price: [v.cost_price || 0],
            original_cost_price: [v.cost_price || 0], // NEW
            effective_from: [''],
            selling_price: [v.selling_price || 0],
            shipping_cost: [v.shipping_cost || 0],
            rto_cost: [v.rto_cost || 0],
            stock: [v.stock || 0]
          })
        );
      });
    } else {
      this.addVariant();
    }
  }
  fieldOptions: any[] = [];
  async fetchCategories() {
    const filters = {
      search: "",
      page: 1,
      limit: 1000
    };
    try {
      const result = await firstValueFrom(this.categoryservice.getAllCategories(filters));
      console.log('Categories:', result);
      // You can assign result.data to your local categories array
      const categoryField = this.fields.find(f => f.key === 'category_id');
      if (categoryField) {
        categoryField.options = result.data.map((c: any) => ({
          label: c.name,  // what shows in dropdown
          value: c.id     // what is submitted in the form
        }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }
  populateplatformOptions() {
    const platformField = this.fields.find(f => f.key === 'platform_code');
    if (platformField) {
      platformField.options = this.PLATFORMS;
    }
  }
  populateColorOptions() {
    const colorField = this.fields.find(f => f.key === 'color');

    if (colorField) {
      colorField.options = [
        ...this.colors1,             // use existing label/value objects
        // { label: 'Other', value: 'OTHER' }
      ];
    }
  }

  onFieldChange(fieldKey: string) {
    if (fieldKey === 'color') {
      const colorControl = this.form.get('color');
      const customColorControl = this.form.get('custom_color');

      if (colorControl?.value === 'OTHER') {
        customColorControl?.setValidators([Validators.required]);
      } else {
        customColorControl?.clearValidators();
        customColorControl?.setValue('');
      }
      customColorControl?.updateValueAndValidity();
    }

    if (fieldKey === 'category_id') {
      // Example: fetch subcategories if needed
      console.log('Category changed:', this.form.get('category_id')?.value);
      // Add your custom logic here
    }

    if (fieldKey === 'platform_code') {
      // Example: adjust pricing or other fields based on platform
      console.log('platform changed:', this.form.get('platform_code')?.value);
      // Add your custom logic here
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productData'] && this.form) {
      this.form.patchValue(this.productData);
    }
  }

  initForm() {
    const group: any = {};
    this.fields
      .filter(f => !['cost_price', 'selling_price', 'shipping_cost', 'rto_cost', 'stock', 'size'].includes(f.key))
      .forEach(f => {
        group[f.key] = [this.productData?.[f.key] ?? '', Validators.required];
      });
    group['custom_color'] = [''];
    group['variants'] = this.fb.array([]);
    this.form = this.fb.group(group);
    this.addVariant();
  }

  get variantsArray() {
    return this.form.get('variants') as any;
  }

  // createVariant(): FormGroup {
  //   const variantFields = ['size', 'cost_price', 'selling_price', 'shipping_cost', 'rto_cost', 'stock'];
  //   const group: any = {};
  //   variantFields.forEach(f => {
  //     group[f] = [this.productData?.[f] ?? '', f === 'size' || f === 'cost_price' || f === 'selling_price' ? Validators.required : ''];
  //   });
  //   return this.fb.group(group);
  // }
  createVariant(): FormGroup {

    return this.fb.group({
      id: [null],
      size: [''],
      cost_price: [0, Validators.required],
      original_cost_price: [0],
      effective_from: [''],
      selling_price: [0, Validators.required],
      shipping_cost: [0],
      rto_cost: [0],
      stock: [0]
    });

  }
  // addVariant() {
  //   this.variantsArray.push(this.createVariant());
  // }
  addVariant() {
    const last = this.variantsArray.at(this.variantsArray.length - 1)?.value;

    this.variantsArray.push(
      this.fb.group({
        id: [null],
        size: [''],
        cost_price: [last?.cost_price || 0, Validators.required],
        original_cost_price: [last?.cost_price || 0],
        effective_from: [''],
        selling_price: [last?.selling_price || 0, Validators.required],
        shipping_cost: [last?.shipping_cost || 0],
        rto_cost: [last?.rto_cost || 0],
        stock: [last?.stock || 0]
      })
    );
  }

  removeVariant(index: number) {
    this.variantsArray.removeAt(index);
  }

  submit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => control.markAsTouched());
      return;
    }

    // Determine color
    let colorValue = this.form.value.color;
    if (colorValue === 'OTHER') {
      colorValue = this.form.value.custom_color;
    }

    // Map variants: add sku and color from main product
    const variantsPayload = this.variantsArray.value.map((v: any) => ({
      id: v.id,
      size: v.size,
      cost_price: Number(v.cost_price),
      effective_from: v.effective_from || null,
      selling_price: Number(v.selling_price),
      shipping_cost: Number(v.shipping_cost),
      rto_cost: Number(v.rto_cost),
      stock: Number(v.stock),
      sku: this.form.value.sku,
      color: colorValue
    }));
    for (const v of this.variantsArray.value) {
      if (
        Number(v.cost_price) !== Number(v.original_cost_price) &&
        !v.effective_from
      ) {
        alert('Please select an Effective From date for the changed cost price.');
        return;
      }
    }
    const payload = {
      catalog_id: String(this.form.value.catalog_id),
      name: this.form.value.name,
      category_id: Number(this.form.value.category_id),
      platform_code: this.form.value.platform_code,
      gst_percent: this.form.value.gst_percent,
      commission_percent: this.form.value.commission_percent,
      // shipping_cost: this.form.value.shipping_cost,
      // rto_cost: this.form.value.rto_cost,
      is_active: this.form.value.is_active ?? true,
      variants: variantsPayload
    };

    const sanitizedPayload = sanitizeFormValues(payload, this.sanitizer);
    this.dialogRef.close(sanitizedPayload);
  }

  cancel() {
    this.dialogRef.close();
  }

  onEffectiveDateChange(index: number): void {
  const variant = this.variantsArray.at(index);

  const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
    width: '500px',
    disableClose: true,
    data: {
      title: 'Confirm Cost Price Change',
      message:
        'Changing the cost price effective date will affect future profit calculations. Do you want to continue?',
        confirmButtonText: 'Apply',
        type:'success'
    }
  });

  dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    if (!confirmed) {
      // Reset the selected date if the user cancels
      variant.get('effective_from')?.setValue('');
    }
  });
}
isSizeReadonly(index: number): boolean {
  const variant = this.variantsArray.at(index);
  return !!variant.get('id')?.value;
}
}