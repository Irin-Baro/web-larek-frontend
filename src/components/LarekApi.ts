import { Api } from './base/api';
import { IProduct, IOrder, IOrderResult } from '../types';

export class LarekApi extends Api {
    getProducts(): Promise<IProduct[]> {
        return this.get('/product').then((data: any) => data.items);
    }

    getProduct(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then((data: any) => data);
    }

    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then((data: any) => data);
    }
}