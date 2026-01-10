/**
 * Типы для работы с корзиной
 */
import { Product } from './product';

// Товар в корзине
export interface CartItem {
    product: Product;
    quantity: number;
}

// Состояние корзины
export interface CartState {
    items: CartItem[];
    total: number;
    totalItems: number;
}

// События корзины
export interface CartAddEvent {
    product: Product;
}

export interface CartRemoveEvent {
    productId: string;
}

export interface CartChangeEvent {
    cart: CartState;
}