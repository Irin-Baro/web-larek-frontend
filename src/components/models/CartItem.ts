import { Model } from '../base/Model';
import { IProduct } from '../../types';
import { EventEmitter } from '../base/events';

interface ICartItem {
    items: IProduct[];
}

export class CartItem extends Model<ICartItem> {
    private items: IProduct[] = [];

    constructor(events: EventEmitter) {
        super({ items: [] }, events);
    }

    add(item: IProduct): void {
        if (!this.items.find(i => i.id === item.id)) {
            this.items.push(item);
            this.emitChanges('basket:changed', this.items);
        }
    }

    remove(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
        this.emitChanges('basket:changed', this.items);
    }

    clear(): void {
        this.items = [];
        this.emitChanges('basket:changed', this.items);
    }

    getTotal(): number {
        return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    getCount(): number {
        return this.items.length;
    }

    getItems(): IProduct[] {
        return [...this.items];
    }

    isInCart(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}