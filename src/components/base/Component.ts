/**
 * Базовый компонент
 * Обеспечивает базовую функциональность для всех UI-компонентов
 */
import { EventEmitter } from "./events";

export abstract class Component<T extends HTMLElement = HTMLElement> {
    protected container: T;
    protected events: EventEmitter;

    constructor(
        templateOrElement: HTMLTemplateElement | HTMLElement,
        eventEmitter: EventEmitter
    ) {
        if (templateOrElement instanceof HTMLTemplateElement) {
            this.container = templateOrElement.content.firstElementChild.cloneNode(true) as T;
        } else {
            this.container = templateOrElement as T;
        }
        this.events = eventEmitter;
    }

    /**
     * Возвращает корневой элемент компонента
     */
    render(): T {
        return this.container;
    }

    /**
     * Инициализация компонента (вызывается после добавления в DOM)
     */
    abstract init(): void;

    /**
     * Установка текста в элемент
     */
    protected setText(selector: string, text: string): void {
        const element = this.container.querySelector(selector);
        if (element) {
            element.textContent = text;
        }
    }

    /**
     * Установка атрибута
     */
    protected setAttribute(selector: string, attr: string, value: string): void {
        const element = this.container.querySelector(selector);
        if (element) {
            element.setAttribute(attr, value);
        }
    }

    /**
     * Установка изображения
     */
    protected setImage(selector: string, src: string, alt?: string): void {
        const element = this.container.querySelector(selector) as HTMLImageElement;
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        } else {
            console.warn(`Image element not found: ${selector}`);
        }
    }

    /**
     * Установка слушателя события
     */
    protected setEventListener(selector: string, event: string, handler: EventListener): void {
        const element = this.container.querySelector(selector);
        if (element) {
            element.addEventListener(event, handler);
        }
    }

    /**
     * Переключение класса
     */
    protected toggleClass(selector: string, className: string, force?: boolean): void {
        const element = this.container.querySelector(selector);
        if (element) {
            element.classList.toggle(className, force);
        }
    }
}