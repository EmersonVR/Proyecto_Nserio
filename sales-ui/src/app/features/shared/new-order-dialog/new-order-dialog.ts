import { Component, Inject, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogService } from '../../../core/services/catalog.service';
import { OrdersService } from '../../../core/services/orders.service';
import { Employee, Product, Shipper, CreateOrderDto } from '../../../core/models/api.models';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PLATFORM_ID, inject as di } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatDividerModule } from '@angular/material/divider';


@Component({
  standalone: true,
  selector: 'app-new-order-dialog',
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatButtonModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    MatToolbarModule,MatDividerModule
  ],
  templateUrl: './new-order-dialog.html',
  styleUrl: './new-order-dialog.scss'
})
export class NewOrderDialogComponent {
  private fb = inject(FormBuilder);
  private catalogs = inject(CatalogService);
  private orders = inject(OrdersService);
  private ref = inject(MatDialogRef<NewOrderDialogComponent>);
  private platformId = di(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);

  employees: Employee[] = [];
  shippers: Shipper[] = [];
  products: Product[] = [];

  form = this.fb.group({
    custId: [1, [Validators.required, Validators.min(1)]],
    empId: [null as number | null, Validators.required],
    shipperId: [null as number | null, Validators.required],
    shipName: ['', [Validators.required, Validators.maxLength(40)]],
    shipAddress: ['', [Validators.required, Validators.maxLength(60)]],
    shipCity: ['', [Validators.required, Validators.maxLength(15)]],
    orderDate: [new Date(), Validators.required],
    requiredDate: [new Date(Date.now() + 7 * 24 * 3600 * 1000), Validators.required],
    shippedDate: [null as Date | null],
    freight: [0, Validators.required],
    shipCountry: ['USA', [Validators.required, Validators.maxLength(15)]],
    productId: [null as number | null, Validators.required],
    unitPrice: [0, [Validators.required, Validators.min(0.01)]],
    qty: [1, [Validators.required, Validators.min(1)]],
    discount: [0, [Validators.required, Validators.min(0), Validators.max(0.999)]],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public inj: { custId: number; customerName?: string }) {
    if (this.inj?.custId) this.form.patchValue({ custId: this.inj.custId });

    if (this.isBrowser) {
      this.catalogs.employees().subscribe({
        next: r => {
          this.employees = r;
          if (!this.form.value.empId && r.length) this.form.patchValue({ empId: r[0].empId });
        },
        error: e => console.error(e)
      });
      this.catalogs.shippers().subscribe({
        next: r => {
          this.shippers = r;
          if (!this.form.value.shipperId && r.length) this.form.patchValue({ shipperId: r[0].shipperId });
        },
        error: e => console.error(e)
      });
      this.catalogs.products().subscribe({
        next: r => {
          this.products = r;
          if (!this.form.value.productId && r.length) this.form.patchValue({ productId: r[0].productId });
        },
        error: e => console.error(e)
      });
    }
  }


  submit() {
    if (this.form.invalid || !this.isBrowser) return;
    const v = this.form.value;
    const dto: CreateOrderDto = {
      custId: v.custId!, empId: v.empId!, shipperId: v.shipperId!,
      shipName: v.shipName!, shipAddress: v.shipAddress!, shipCity: v.shipCity!,
      orderDate: this.toIso(v.orderDate), requiredDate: this.toIso(v.requiredDate),
      shippedDate: v.shippedDate ? this.toIso(v.shippedDate) : null,
      freight: v.freight!, shipCountry: v.shipCountry!,
      productId: v.productId!, unitPrice: v.unitPrice!, qty: v.qty!, discount: v.discount!
    };
    this.orders.create(dto).subscribe({
      next: res => this.ref.close(res),
      error: err => console.error('create order failed', err)
    });
  }

  private toIso(d: Date | string | null | undefined): string {
    if (!d) return new Date().toISOString();
    return (d instanceof Date)
      ? new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString()
      : d;
  }
}
