import { Api, ApiListResponse } from './base/api';
import { IProduct, IOrder } from '../types';

export interface ILarekApi {
  getProductList: () => Promise<IProduct[]>;
  getProductItem: (id: string) => Promise<IProduct>;
  orderProduct: (order: IOrder) => Promise<{ total: number }>;
}

export class LarekApi extends Api implements ILarekApi {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getProductList(): Promise<IProduct[]> {
    return this.get('/product').then((data: ApiListResponse<IProduct>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + (item.image ? item.image.replace('.svg', '.png') : ''),
      }))
    );
  }

  getProductItem(id: string): Promise<IProduct> {
    return this.get(`/product/${id}`).then((data: IProduct) => ({
      ...data,
      image: this.cdn + (data.image || ''),
    }));
  }

  orderProduct(order: IOrder): Promise<{ total: number }> {
    return this.post('/order', order).then((data: { total: number }) => data);
  }
}
