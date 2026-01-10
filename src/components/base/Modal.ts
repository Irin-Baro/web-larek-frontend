/**
 * Базовый класс для модальных окон
 */
import { Component } from './Component';
import { EventEmitter } from './events';

export class Modal<T extends HTMLElement = HTMLElement> extends Component<T> {
    protected closeButton: HTMLButtonElement | null;
    protected overlay: HTMLElement | null;
    private escapeHandler: (event: KeyboardEvent) => void;

    constructor(templateOrElement: HTMLTemplateElement | HTMLElement, eventEmitter: EventEmitter) {
        super(templateOrElement, eventEmitter);
        
        this.closeButton = this.container.querySelector('.modal__close');
        this.overlay = this.container.querySelector('.modal__overlay');
        this.escapeHandler = this.handleEscape.bind(this);
    }

    init(): void {
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.close());
        }

        if (this.overlay) {
            this.overlay.addEventListener('click', (event) => {
                if (event.target === this.overlay) {
                    this.close();
                }
            });
        }
    }

    private handleEscape(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.close();
        }
    }

    open(): void {
        document.body.appendChild(this.container);
        this.container.classList.add('modal_active');

        document.addEventListener('keydown', this.escapeHandler);
        
        this.events.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');

        document.removeEventListener('keydown', this.escapeHandler);
        
        setTimeout(() => {
            if (this.container.parentElement) {
                this.container.parentElement.removeChild(this.container);
            }
        }, 200);
        
        this.events.emit('modal:close');
    }

    setContent(content: HTMLElement): void {
        const contentContainer = this.container.querySelector('.modal__content');
        if (contentContainer) {
            contentContainer.innerHTML = '';
            contentContainer.appendChild(content);
        }
    }
}