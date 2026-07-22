import { Component } from '../../base/Component';
import { EventEmitter } from '../../base/events';

export class Modal extends Component<{}> {
    protected _closeButton: HTMLElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._closeButton = container.querySelector('.modal__close') as HTMLElement;
        this._content = container.querySelector('.modal__content') as HTMLElement;

        this._closeButton?.addEventListener('click', () => {
            this.close();
        });

        container.addEventListener('click', (e) => {
            if (e.target === container) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.container.classList.contains('modal_active')) {
                this.close();
            }
        });
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        this._content.replaceChildren();
        this.events.emit('modal:close');
    }
}