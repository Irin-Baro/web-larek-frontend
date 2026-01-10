/**
 * Типы для работы с товарами
 */

// Категории товаров (на основе данных из API)
export type ProductCategory = 
    | 'софт-скил'
    | 'хард-скил'
    | 'дополнительное'
    | 'кнопка'
    | 'другое';

// Товар с сервера
export interface Product {
    id: string;
    title: string;
    description: string;
    image: string; 
    category: ProductCategory;
    price: number | null; 
}

// Товар для отображения (с форматированными данными)
export interface DisplayProduct extends Product {
    formattedPrice: string;
    isAvailable: boolean;
    categoryClass: string; 
}