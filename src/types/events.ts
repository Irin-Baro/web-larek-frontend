/**
 * Типы для системы событий
 */

export type AppEvent =
    // Каталог
    | 'catalog:changed'
    | 'product:select'
    | 'product:preview'
    | 'product:not-available'
    
    // Корзина
    | 'cart:add'
    | 'cart:remove'
    | 'cart:changed'
    | 'cart:open'
    | 'cart:close'
    | 'cart:clear'
    | 'cart:error'
    
    // Модальные окна
    | 'modal:open'
    | 'modal:close'
    
    // Заказ
    | 'order:address:submit'
    | 'order:contacts:submit'
    | 'order:payment:change'
    | 'order:submit'
    | 'order:success'
    | 'order:error'
    | 'order:validation-error'
    
    // Формы
    | 'formErrors:change'
    
    // Навигация
    | 'page:changed'
    
    // API
    | 'api:error';