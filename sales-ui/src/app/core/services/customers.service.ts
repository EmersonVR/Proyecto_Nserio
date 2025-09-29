import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CustomerPrediction, PagedResult, PageQuery } from '../models/api.models';
import { toHttpParams } from './http-helpers';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomersService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/customers`;

  get(q: PageQuery): Observable<PagedResult<CustomerPrediction>> {
    return this.http.get<PagedResult<CustomerPrediction>>(this.base, { params: toHttpParams(q) });
  }
}
