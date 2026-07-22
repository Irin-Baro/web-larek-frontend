import { Model } from '../base/Model';
import { IOrder, FormErrors } from '../../types';
import { EventEmitter } from '../base/events';

interface IOrderData {
    payment: 'online' | 'cash' | null;
    address: string;
    email: string;
    phone: string;
    total: number;
    items: string[];
}

export class OrderData extends Model<IOrderData> {
    payment: 'online' | 'cash' | null = null;
    address: string = '';
    email: string = '';
    phone: string = '';
    formErrors: FormErrors = {};
    total: number = 0;
    items: string[] = [];

    constructor(events: EventEmitter) {
        super({ 
            payment: null, 
            address: '', 
            email: '', 
            phone: '',
            total: 0,
            items: []
        }, events);
    }

    setField(field: keyof IOrder, value: string): void {
        if (field === 'payment') {
            this.payment = value as 'online' | 'cash';
        } else if (field === 'address' || field === 'email' || field === 'phone') {
            (this as any)[field] = value;
        }
        this.validateAll();
    }

    validateAll(): void {
        const errors: FormErrors = {};
        if (!this.payment) errors.payment = 'Выберите способ оплаты';
        if (!this.address) errors.address = 'Укажите адрес';
        if (!this.email) errors.email = 'Укажите email';
        if (!this.phone) errors.phone = 'Укажите телефон';
        this.formErrors = errors;
        this.emitChanges('formErrors:changed', this.formErrors);
    }

    getOrderData(): IOrder {
        return {
            payment: this.payment!,
            address: this.address,
            email: this.email,
            phone: this.phone,
            total: this.total,
            items: this.items
        };
    }
}