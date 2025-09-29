import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ClientOrder, CreateOrderDto, PagedResult, PageQuery } from '../models/api.models';
import { toHttpParams } from './http-helpers';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/orders`;

  getByCustomer(customerId: number, q: PageQuery): Observable<PagedResult<ClientOrder>> {
    const params = toHttpParams(q).set('customerId', customerId);
    return this.http.get<PagedResult<ClientOrder>>(this.base, { params });
  }

  create(dto: CreateOrderDto): Observable<{ orderId: number }> {
    return this.http.post<{ orderId: number }>(this.base, dto);
  }
}
