/**
 * Типы для оформления заказа
 */

// Способ оплаты
export type PaymentMethod = 'online' | 'upon-receipt';

// Адрес доставки
export interface OrderAddress {
    payment: PaymentMethod;
    address: string;
}

// Контактные данные
export interface OrderContacts {
    email: string;
    phone: string;
}

// Полный заказ для отправки на сервер
export interface Order extends OrderAddress, OrderContacts {
    items: string[]; 
    total: number;
}

// Ответ при успешном заказе
export interface OrderSuccess {
    orderId: string;
    total: number;
}

// Ошибки валидации заказа
export interface OrderValidationErrors {
    address?: string;
    email?: string;
    phone?: string;
}