import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';

export class Basket extends Component<{ items: HTMLElement[]; total: number }> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        
        this._list = container.querySelector('.basket__list') as HTMLElement;
        this._total = container.querySelector('.basket__price') as HTMLElement;
        this._button = container.querySelector('.basket__button') as HTMLButtonElement;

        this._button.addEventListener('click', () => {
            events.emit('order:open');
        });
    }

    set items(items: HTMLElement[]) {
        if (items.length === 0) {
            this._list.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
            this._button.disabled = true;
        } else {
            this._list.replaceChildren(...items);
            this._button.disabled = false;
        }
    }

    set total(value: number) {
        this.setText(this._total, `${value} синапсов`);
    }
}