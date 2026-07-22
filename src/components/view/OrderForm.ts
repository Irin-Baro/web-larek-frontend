import { Form } from './common/Form';
import { EventEmitter } from '../base/events';

export class OrderForm extends Form<{ payment: string; address: string }> {
    protected _buttons: HTMLElement;

    constructor(container: HTMLFormElement, events: EventEmitter) {
        super(container, events);

        this._buttons = container.querySelector('.order__buttons') as HTMLElement;

        this._buttons?.addEventListener('click', (e) => {
            const target = e.target as HTMLButtonElement;
            if (target.name === 'card' || target.name === 'cash') {
                this.toggleButtons(target.name);
                this.events.emit('payment:toggle', { payment: target.name });
            }
        });
    }

    toggleButtons(name: string) {
        const buttons = this._buttons?.querySelectorAll('.button_alt');
        buttons?.forEach(btn => {
            btn.classList.remove('button_alt-active');
            if ((btn as HTMLButtonElement).name === name) {
                btn.classList.add('button_alt-active');
            }
        });
    }

    set address(value: string) {
        const input = this.container.querySelector('input[name="address"]') as HTMLInputElement;
        if (input) input.value = value;
    }
}