/**
 * Компонент карточки товара
 */
import { Component } from '../../base/Component';
import { Product } from '../../../types/product';
import { EventEmitter } from '../../base/events';

export class ProductCard extends Component<HTMLElement> {
    private _button: HTMLButtonElement | null;

    constructor(
        template: HTMLTemplateElement,
        eventEmitter: EventEmitter,
        private product: Product,
        private baseUrl: string
    ) {
        super(template, eventEmitter);
        
        this._button = this.container.querySelector('.card__button');
        
        this.render();
        this.init();
    }

    init(): void {
        this.container.addEventListener('click', () => {
            this.events.emit('product:select', this.product);
        });

        if (this._button) {
            this._button.addEventListener('click', (event) => {
                event.stopPropagation(); 
                
                if (this.product.price !== null) {
                    this.events.emit('cart:add', this.product);
                } else {
                    console.info('Товар недоступен для покупки');
                }
            });
        }
    }

    render(): HTMLElement {
        this.setText('.card__title', this.product.title);
        
        const textElement = this.container.querySelector('.card__text');
        if (textElement && this.product.description) {
            textElement.textContent = this.product.description;
        }
        
        const priceText = this.product.price !== null 
            ? `${this.product.price} синапсов` 
            : 'Бесплатно';
        this.setText('.card__price', priceText);
        
        const imagePath = `${this.baseUrl}${this.product.image}`;
        this.setImage('.card__image', imagePath, this.product.title);
        
        const categoryElement = this.container.querySelector('.card__category');
        if (categoryElement) {
            categoryElement.textContent = this.product.category;
            categoryElement.classList.add(`card__category_${this.product.category}`);
        }
        
        if (this._button && this.product.price === null) {
            this._button.disabled = true;
            this._button.textContent = 'Недоступно';
        }
        
        return this.container;
    }
}
