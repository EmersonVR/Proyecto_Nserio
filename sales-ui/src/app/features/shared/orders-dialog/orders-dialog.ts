import { Component, Inject, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { OrdersService } from '../../../core/services/orders.service';
import { ClientOrder, PageQuery, PagedResult } from '../../../core/models/api.models';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { PLATFORM_ID, inject as di } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  standalone: true,
  selector: 'app-orders-dialog',
  imports: [CommonModule, MatDialogModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule,MatToolbarModule],
  templateUrl: './orders-dialog.html',
  styleUrls: ['./orders-dialog.scss']
})
export class OrdersDialogComponent {
  private srv = inject(OrdersService);
  private platformId = di(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);

  customerId!: number;
  cols = ['orderId', 'requiredDate', 'shippedDate', 'shipName', 'shipAddress', 'shipCity'];
  data: ClientOrder[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  sortBy?: string = 'RequiredDate';
  sortDir?: 'ASC' | 'DESC' = 'DESC';

  constructor(@Inject(MAT_DIALOG_DATA) public inj: { custId: number; customerName?: string }) {
    this.customerId = inj.custId;
    if (this.isBrowser) this.load();
  }

  load() {
    if (!this.isBrowser) return;
    const q: PageQuery = { page: this.page, pageSize: this.pageSize, sortBy: this.sortBy, sortDir: this.sortDir };
    this.srv.getByCustomer(this.customerId, q).subscribe({
      next: (res: PagedResult<ClientOrder>) => { this.data = res.items; this.total = res.total; },
      error: (err) => { console.error('orders load failed', err); this.data = []; this.total = 0; }
    });
  }
  onPage(e: PageEvent) { this.page = (e.pageIndex ?? 0) + 1; this.pageSize = e.pageSize ?? 10; this.load(); }
  onSort(e: Sort) { this.sortBy = e.active ? this.cap(e.active) : undefined; this.sortDir = e.direction ? e.direction.toUpperCase() as any : undefined; this.load(); }
  private cap(k: string) { return k ? k.charAt(0).toUpperCase() + k.slice(1) : k; }
}
