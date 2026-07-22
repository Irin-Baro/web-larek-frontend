export type ProductCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: ProductCategory;
    price: number | null;
}

export interface IOrder {
    payment: 'online' | 'cash' | null;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
    id: string;
    total: number;
}