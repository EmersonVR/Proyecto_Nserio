export interface PageQuery { page?: number; pageSize?: number; sortBy?: string; sortDir?: 'ASC'|'DESC'; search?: string; }
export interface PagedResult<T> { items: T[]; total: number; }

export interface CustomerPrediction { custId: number; customerName: string; lastOrderDate?: string; nextPredictedOrder?: string; }
export interface ClientOrder { orderId: number; requiredDate?: string; shippedDate?: string; shipName: string; shipAddress: string; shipCity: string; }

export interface Employee { empId: number; fullName: string; }
export interface Shipper { shipperId: number; companyName: string; }
export interface Product { productId: number; productName: string; }

export interface CreateOrderDto {
  custId: number; empId: number; shipperId: number;
  shipName: string; shipAddress: string; shipCity: string;
  orderDate: string; requiredDate: string; shippedDate?: string | null;
  freight: number; shipCountry: string;
  productId: number; unitPrice: number; qty: number; discount: number;
}
