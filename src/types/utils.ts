/**
 * Типы для утилит
 */

// Из src/utils/utils.ts
export type SelectorCollection<T> = string | NodeListOf<Element> | T[];
export type SelectorElement<T> = T | string;