/**
 * Типы состояния приложения
 */
import { Product } from './product';
import { CartState } from './cart';
import { Order } from './order';

// Глобальное состояние приложения
export interface AppState {
    catalog: Product[];
    cart: CartState;
    order: Partial<Order>;
    preview: Product | null;
    loading: boolean;
}