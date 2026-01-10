/**
 * Компонент корзины товаров
 */
import { Component } from '../../base/Component';
import { EventEmitter } from '../../base/events';
import { CartState } from '../../../types/cart';

export class Cart extends Component<HTMLElement> {
    constructor(
        template: HTMLTemplateElement,
        eventEmitter: EventEmitter,
        private cartState: CartState
    ) {
        super(template, eventEmitter);
        
        this.init();
    }

    init(): void {        
        this.events.on('cart:changed', (state: CartState) => {
            console.info(`New state: ${state.totalItems} items, ${state.total} синапсов`);
        });
        
        const checkoutBtn = this.container.querySelector('.basket__button');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.events.emit('order:open');
            });
        }
    }

    render(): HTMLElement {
        const priceElement = this.container.querySelector('.basket__price');
        if (priceElement) {
            priceElement.textContent = `${this.cartState.total} синапсов`;
        }
        
        return this.container;
    }
}