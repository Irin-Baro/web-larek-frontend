/**
 * Базовый класс для страниц приложения
 */
import { Component } from './Component';
import { EventEmitter } from './events';

export abstract class Page<T extends HTMLElement = HTMLElement> extends Component<T> {
    constructor(template: HTMLTemplateElement, eventEmitter: EventEmitter) {
        super(template, eventEmitter);
    }

    /**
     * Отображение страницы
     */
    show(): void {
        const appContainer = document.getElementById('app');
        if (appContainer) {
            appContainer.innerHTML = '';
            appContainer.appendChild(this.container);
        }
        this.events.emit('page:changed');
    }
}