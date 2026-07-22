export abstract class Component<T> {
    protected container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    protected toggleClass(element: HTMLElement, className: string, force?: boolean): void {
        element.classList.toggle(className, force);
    }

    protected setText(element: HTMLElement, value: string): void {
        if (element) {
            element.textContent = value;
        }
    }

    protected setImage(element: HTMLImageElement, src: string, alt?: string): void {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    protected setDisabled(element: HTMLElement, state: boolean): void {
        if (element) {
            if (state) {
                element.setAttribute('disabled', 'disabled');
            } else {
                element.removeAttribute('disabled');
            }
        }
    }

    protected setHidden(element: HTMLElement, state: boolean): void {
        if (element) {
            element.style.display = state ? 'none' : '';
        }
    }

    render(data?: Partial<T>): HTMLElement {
        if (data) {
            Object.assign(this, data);
        }
        return this.container;
    }
}