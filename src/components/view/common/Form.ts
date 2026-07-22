import { Component } from '../../base/Component';
import { EventEmitter } from '../../base/events';

export abstract class Form<T> extends Component<T> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: EventEmitter) {
        super(container);

        this._submit = container.querySelector('button[type="submit"]') as HTMLButtonElement;
        this._errors = container.querySelector('.form__errors') as HTMLElement;

        container.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit(`${container.name}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit('input:change', { field, value });
    }

    set valid(value: boolean) {
        if (this._submit) { 
            this._submit.disabled = !value;
        }
    }

    set errors(value: string) {
        if (this._errors) { 
            this.setText(this._errors, value);
        }
    }
}