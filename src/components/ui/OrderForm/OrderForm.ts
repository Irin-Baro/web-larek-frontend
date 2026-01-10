/**
 * Компонент формы заказа
 */
import { Component } from '../../base/Component';
import { EventEmitter } from '../../base/events';
import { Order } from '../../../types/order';

export class OrderForm extends Component<HTMLElement> {
    constructor(
        template: HTMLTemplateElement,
        eventEmitter: EventEmitter,
        private orderData: Partial<Order> = {}
    ) {
        super(template, eventEmitter);
        this.init();
    }

    init(): void {

        const paymentButtons = this.container.querySelectorAll('.button_alt');
        paymentButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.events.emit('order:payment:change', { 
                    method: btn.textContent?.toLowerCase() || 'unknown' 
                });
            });
        });
        
        const form = this.container.querySelector('form');
        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                this.events.emit('order:submit', { status: 'ready' });
            });
        }
    }

    render(): HTMLElement {
        return this.container;
    }
}