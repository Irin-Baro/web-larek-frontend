/**
 * Базовые типы для работы с API
 */

// Ответ API с пагинацией
export interface ApiListResponse<T> {
    total: number;
    items: T[];
}

// Ответ API при успешном заказе
export interface ApiOrderResponse {
    id: string;
    total: number;
}

// Ошибка API
export interface ApiError {
    error: string;
}

// Методы HTTP для API
export type ApiPostMethod = 'POST' | 'PUT' | 'DELETE';