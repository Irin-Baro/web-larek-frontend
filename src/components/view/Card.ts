import { Component } from '../base/Component';
import { IProduct, ProductCategory } from '../../types';
import { EventEmitter } from '../base/events';

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
    onAddToCart?: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _index?: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter, actions?: ICardActions) {
        super(container);

        this._title = container.querySelector('.card__title') as HTMLElement;
        this._price = container.querySelector('.card__price') as HTMLElement;
        this._image = container.querySelector('.card__image') as HTMLImageElement;
        this._category = container.querySelector('.card__category') as HTMLElement;
        this._description = container.querySelector('.card__text') as HTMLElement;
        this._button = container.querySelector('.card__button') as HTMLButtonElement;
        this._index = container.querySelector('.basket__item-index') as HTMLElement;

        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }

        if (this._button && actions?.onAddToCart) {
            this._button.addEventListener('click', (e) => {
                e.stopPropagation();
                actions.onAddToCart?.(e);
            });
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
            if (this._button) this.setDisabled(this._button, true);
        } else {
            this.setText(this._price, `${value} синапсов`);
            if (this._button) this.setDisabled(this._button, false);
        }
    }

    set image(value: string) {
        if (this._image) {
            this.setImage(this._image, value, this._title?.textContent || 'Товар');
        }
    }

    set category(value: ProductCategory) {
        if (this._category) {
            this.setText(this._category, value);
            const categoryClass = this.getCategoryClass(value);
            this._category.className = `card__category card__category_${categoryClass}`;
        }
    }

    set description(value: string) {
        if (this._description) {
            this.setText(this._description, value);
        }
    }

    set index(value: number) {
        if (this._index) {
            this.setText(this._index, String(value));
        }
    }

    set inCart(value: boolean) {
        if (this._button) {
            this.setText(this._button, value ? 'Убрать' : 'Купить');
        }
    }

    private getCategoryClass(category: ProductCategory): string {
        const map: Record<ProductCategory, string> = {
            'софт-скил': 'soft',
            'хард-скил': 'hard',
            'другое': 'other',
            'дополнительное': 'additional',
            'кнопка': 'button'
        };
        return map[category] || 'other';
    }
}