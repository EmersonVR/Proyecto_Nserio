// src/app/core/services/catalog.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Employee, Shipper, Product } from '../models/api.models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api`;

  employees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.base}/employees`);
  }
  shippers(): Observable<Shipper[]> {
    return this.http.get<Shipper[]>(`${this.base}/shippers`);
  }
  products(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/products`);
  }
}
