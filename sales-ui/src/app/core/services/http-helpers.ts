import { HttpParams } from '@angular/common/http';
import { PageQuery } from '../models/api.models';

export function toHttpParams(q?: PageQuery): HttpParams {
  let p = new HttpParams();
  if (!q) return p;
  if (q.page) p = p.set('page', q.page);
  if (q.pageSize) p = p.set('pageSize', q.pageSize);
  if (q.sortBy) p = p.set('sortBy', q.sortBy);
  if (q.sortDir) p = p.set('sortDir', q.sortDir);
  if (q.search) p = p.set('search', q.search);
  return p;
}
