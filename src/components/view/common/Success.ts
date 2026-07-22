import { Component } from '../../base/Component';
import { EventEmitter } from '../../base/events';

export class Success extends Component<{ total: number }> {
    protected _closeButton: HTMLElement;
    protected _description: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._closeButton = container.querySelector('.order-success__close') as HTMLElement;
        this._description = container.querySelector('.order-success__description') as HTMLElement;

        this._closeButton.addEventListener('click', () => {
            events.emit('success:close');
        });
    }

    set total(value: number) {
        this.setText(this._description, `Списано ${value} синапсов`);
    }
}