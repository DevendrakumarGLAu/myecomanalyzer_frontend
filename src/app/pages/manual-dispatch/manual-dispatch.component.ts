import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { InvoiceService } from '../../services/invoice.service';
import { DELIVERY_PARTNERS, Product_COLORS, Product_PLATFORMS, SelectOption } from '../../common/constant/platform.constants';
import { ToastService } from '../../services/toast.service';
import { sanitizeFormValues } from '../../shared/form-sanitizer';

interface FormField {
  name: string;
  label: string;
  type: string;
  options?: SelectOption[];
  required?: boolean;
}

@Component({
  selector: 'app-manual-dispatch',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manual-dispatch.component.html'
})
export class ManualDispatchComponent implements OnInit {

  form!: FormGroup;
  colors = Product_COLORS;
  platforms = Product_PLATFORMS;
  deliveryPartners = DELIVERY_PARTNERS;


  fields: FormField[] = [
    { name: 'platform_code', label: 'Platform', type: 'select', options: this.platforms, required: true },

    { name: 'marketplace_order_id', label: 'Marketplace Order ID', type: 'text', required: true },
    { name: 'sub_order_id', label: 'Sub Order ID', type: 'text', required: true },

    { name: 'sku', label: 'SKU', type: 'text', required: true },
    { name: 'size', label: 'Size', type: 'text', required: true },
    { name: 'color', label: 'Color', type: 'select', options: this.colors, required: true },

    { name: 'quantity', label: 'Quantity', type: 'number', required: true },
    { name: 'selling_price', label: 'Selling Price', type: 'number', required: true },

    { name: 'customer_name', label: 'Customer Name', type: 'text', required: true },
    { name: 'state', label: 'State', type: 'text' },
    { name: 'pincode', label: 'Pincode', type: 'text' },
    { name: 'address', label: 'Address', type: 'textarea' },

    {
      name: 'delivery_partner', label: 'Delivery Partner', type: 'select',
      options: this.deliveryPartners,
      required: true
    },

    { name: 'payment_type', label: 'Payment Type', type: 'select', options: [{ label: 'PREPAID', value: 'PREPAID' }, { label: 'COD', value: 'COD' }, { label: 'EXCHANGE', value: 'EXCHANGE' }] },

    { name: 'order_date', label: 'Order Date', type: 'date' }
  ];

  loading = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private toaster: ToastService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  // ✅ Build dynamic form
  buildForm() {
    const group: any = {};

    this.fields.forEach(field => {
      const validators = [];

      if (field.required) validators.push(Validators.required);

      if (field.type === 'number') validators.push(Validators.min(0));

      group[field.name] = [
        this.getDefaultValue(field.name),
        validators
      ];
    });

    this.form = this.fb.group(group);
  }

  // ✅ Default values
  getDefaultValue(name: string) {
    const defaults: any = {
      platform_code: 'meesho',
      quantity: 1,
      selling_price: 0,
      payment_type: 'PREPAID'
    };
    return defaults[name] ?? '';
  }
  messageType: 'success' | 'warning' | 'error' = 'success';
  // ✅ Submit
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.message = '';

    const sanitizedPayload = sanitizeFormValues(this.form.value, this.sanitizer);
    this.invoiceService.createSingleOrder(sanitizedPayload).subscribe({
      next: (res: any) => {
        this.loading = false;

        if (res?.success) {
          this.message = res.message;
          this.toaster.success(this.message);
          if (res.is_duplicate) {
            this.messageType = 'warning'; // yellow
          } else {
            this.messageType = 'success'; // green
          }
          this.form.reset();
          this.buildForm(); // reset defaults

        } else {
          this.message = '❌ ' + (res?.message || 'Failed');
          this.toaster.error(this.message);
        }
      },
      error: (err) => {
        this.loading = false;
        this.message = '❌ Error: ' + (err?.error?.message || err.message);
        this.toaster.error('Failed to create order');
      }
    });
  }

  // ✅ Helper for template
  getControl(name: string) {
    return this.form.get(name);
  }
}