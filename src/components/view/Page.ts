import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';

export class Page extends Component<{}> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._counter = container.querySelector('.header__basket-counter') as HTMLElement;
        this._catalog = container.querySelector('.gallery') as HTMLElement;
        this._wrapper = container.querySelector('.page__wrapper') as HTMLElement;

        const basketButton = container.querySelector('.header__basket') as HTMLElement;
        basketButton?.addEventListener('click', () => {
            events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
    }
}