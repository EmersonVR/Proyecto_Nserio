import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';

import { CustomersService } from '../../../core/services/customers.service';
import { CustomerPrediction, PageQuery, PagedResult } from '../../../core/models/api.models';

// ⚠️ IMPORTA los diálogos desde sus archivos *.component.ts
import { OrdersDialogComponent } from '../../shared/orders-dialog/orders-dialog';
import { NewOrderDialogComponent } from '../../shared/new-order-dialog/new-order-dialog';

@Component({
  selector: 'app-predictions-page',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatDividerModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './predictions-page.html',
  styleUrls: ['./predictions-page.scss'] // <- plural
})
export class PredictionsPageComponent {
  private srv = inject(CustomersService);
  private dialog = inject(MatDialog);
  private platformId = inject(PLATFORM_ID);

  readonly isBrowser = isPlatformBrowser(this.platformId);

  // UI state
  loading = false;
  cols = ['customerName', 'lastOrderDate', 'nextPredictedOrder', 'actions'];
  data: CustomerPrediction[] = [];
  total = 0;

  // query state
  page = 1;
  pageSize = 10;
  sortBy: string | undefined = 'NextPredictedOrder';
  sortDir: 'ASC' | 'DESC' | undefined = 'DESC';
  searchCtrl = new FormControl<string>('', { nonNullable: true });

  constructor() {
    if (this.isBrowser) {
      this.searchCtrl.valueChanges
        .pipe(debounceTime(350), distinctUntilChanged())
        .subscribe(() => {
          this.page = 1;
          this.load();
        });

      this.load();
    }
  }

  load(): void {
    const q: PageQuery = {
      page: this.page,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortDir: this.sortDir,
      search: this.searchCtrl.value || undefined
    };

    this.loading = true;
    this.srv.get(q)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: PagedResult<CustomerPrediction>) => {
          this.data = res.items;
          this.total = res.total;
        },
        error: (err) => {
          console.error('Customers load failed', err);
          this.data = [];
          this.total = 0;
        },
      });
  }

  onPage(e: PageEvent) {
    this.page = (e.pageIndex ?? 0) + 1;
    this.pageSize = e.pageSize ?? 10;
    if (this.isBrowser) this.load();
  }

  onSort(e: Sort) {
    this.sortBy = e.active ? this.cap(e.active) : undefined; // API usa PascalCase
    this.sortDir = e.direction ? (e.direction.toUpperCase() as 'ASC' | 'DESC') : undefined;
    if (this.isBrowser) this.load();
  }

  private cap(k: string) {
    return k ? k.charAt(0).toUpperCase() + k.slice(1) : k;
  }

  openOrders(row: CustomerPrediction) {
    if (!this.isBrowser) return;
    this.dialog.open(OrdersDialogComponent, {
      data: { custId: row.custId, customerName: row.customerName },
      panelClass: 'full-dialog',
      width: '70vw',
      maxWidth: '70vw',
      height: '70vh',
      maxHeight: '70vh',
      autoFocus: false
    });
  }

  openNewOrder(row: CustomerPrediction) {
    if (!this.isBrowser) return;
    this.dialog.open(NewOrderDialogComponent, {
      width: '700px',
      data: { custId: row.custId, customerName: row.customerName }
    });
  }
}