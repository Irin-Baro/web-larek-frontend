import { Model } from '../base/Model';
import { IProduct } from '../../types';
import { EventEmitter } from '../base/events';

interface IProductData {
    catalog: IProduct[];
}

export class ProductData extends Model<IProductData> {
    catalog: IProduct[] = [];

    constructor(events: EventEmitter) {
        super({ catalog: [] }, events);
    }

    setCatalog(items: IProduct[]) {
        this.catalog = items;
        this.emitChanges('items:changed', this.catalog);
    }

    getProduct(id: string): IProduct | undefined {
        return this.catalog.find(item => item.id === id);
    }
}