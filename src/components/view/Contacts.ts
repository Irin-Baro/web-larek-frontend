import { Form } from './common/Form';
import { EventEmitter } from '../base/events';

export class Contacts extends Form<{ email: string; phone: string }> {
    constructor(container: HTMLFormElement, events: EventEmitter) {
        super(container, events);
    }

    set email(value: string) {
        const input = this.container.querySelector('input[name="email"]') as HTMLInputElement;
        if (input) input.value = value;
    }

    set phone(value: string) {
        const input = this.container.querySelector('input[name="phone"]') as HTMLInputElement;
        if (input) input.value = value;
    }
}