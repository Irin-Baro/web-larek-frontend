/**
 * Компонент модального окна успешного заказа
 */
import { Component } from '../../base/Component';
import { EventEmitter } from '../../base/events';

export class SuccessModal extends Component<HTMLElement> {
    constructor(
        template: HTMLTemplateElement,
        eventEmitter: EventEmitter
    ) {
        super(template, eventEmitter);        
        this.init();
    }

    init(): void {

        const closeButton = this.container.querySelector('.order-success__close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.events.emit('success:close');
            });
        }
    }

    render(): HTMLElement {
        return this.container;
    }
    
    /**
     * Метод для обновления суммы 
     */
    setTotal(total: number): void {
        const desc = this.container.querySelector('.order-success__description');
        if (desc) {
            desc.textContent = `Списано ${total} синапсов`;
        }
    }
}