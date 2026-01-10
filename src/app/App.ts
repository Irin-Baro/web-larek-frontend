/**
 * Главный класс приложения
 * Инициализирует все компоненты и управляет состоянием
 */

import { EventEmitter } from '../components/base';
import { Api } from '../components/base';
import { ProductCard } from '../components/ui/ProductCard/ProductCard';
import { Product } from '../types/product';
import { Modal } from '../components/base/Modal';
import { Cart } from '../components/ui/Cart/Cart';
import { OrderForm } from '../components/ui/OrderForm/OrderForm';
import { CartState } from '../types/cart'; 
import { SuccessModal } from '../components/ui/SuccessModal/SuccessModal';

export class App {
    private events: EventEmitter;
    private api: Api;
    private baseUrl: string;
    private modal: Modal | null = null;
    private cart: Cart | null = null;
    private orderForm: OrderForm | null = null;

    constructor() {
        // Инициализация брокера событий
        this.events = new EventEmitter();
        
        // Получение базового URL
        this.baseUrl = process.env.API_ORIGIN || 'https://larek-api.nomoreparties.co';
        
        // Инициализация API-клиента
        this.api = new Api(`${this.baseUrl}/api/weblarek`);
        
        // Подписка на глобальные события
        this.setupEventListeners();

    }

    private setupEventListeners(): void {
        // Подписка на все события для отладки
        this.events.onAll((event) => {
            console.info('App event:', event);
        });

        // Обработка ошибок API
        this.events.on('api:error', (error) => {
            console.error('API Error:', error);
        });
    }

    /**
     * Запуск приложения
     */
    start(): void {
        // Загрузка каталога товаров
        this.loadCatalog();
    }

    private async loadCatalog(): Promise<void> {
        try {
            // Получаем товары с API
            const response = await this.api.get('/product') as { items: Product[], total: number };
            
            // Отображаем каталог
            this.renderCatalog(response.items);
            
            // Тестируем другие компоненты
            this.testOtherComponents();
        } catch (error) {
            this.events.emit('api:error', error);
        }
    }

    private renderCatalog(products: Product[]): void {
        const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
        const galleryContainer = document.querySelector('.gallery') as HTMLElement;
        
        if (!cardTemplate || !galleryContainer) {
            console.error('Template or container not found!');
            return;
        }
        galleryContainer.innerHTML = '';
        
        // Создаём карточки
        products.forEach(product => {
            const card = new ProductCard(cardTemplate, this.events, product, this.baseUrl);
            galleryContainer.appendChild(card.render());
        });

    }

    private testOtherComponents(): void {
        // 1. Тест модального окна
        const modalContainer = document.querySelector('#modal-container') as HTMLElement;
        if (modalContainer) {
            this.modal = new Modal(modalContainer, this.events);
        } else {
            console.warn('Modal container not found');
        }
        
        // 2. Тест корзины
        const cartTemplate = document.querySelector('#basket') as HTMLTemplateElement;
        if (cartTemplate) {
            const emptyCart: CartState = { 
                items: [], 
                total: 0, 
                totalItems: 0 
            };
            this.cart = new Cart(cartTemplate, this.events, emptyCart);
        } else {
            console.warn('Cart template (#basket) not found in HTML');
        }

        // Обработка клика по корзине в хедере
        const headerBasket = document.querySelector('.header__basket');
        if (headerBasket) {
            headerBasket.addEventListener('click', () => {
                this.events.emit('cart:open');
            });
            
            // Подписка на открытие корзины
            this.events.on('cart:open', () => {
                // TODO: открыть модальное окно с корзиной
            });
        }
        
        // 3. Тест формы заказа
        const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
        if (orderTemplate) {
            this.orderForm = new OrderForm(orderTemplate, this.events, {});
        } else {
            console.warn('Order form template (#order) not found in HTML');
        }
        
        // 4. Тест успешного заказа
        const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
        if (successTemplate) {
            const successModal = new SuccessModal(successTemplate, this.events);
            
            // установка суммы через метод
            successModal.setTotal?.(153250);
            
            // подписка на событие закрытия
            this.events.on('success:close', () => {
            });
        }
    }

    /**
     * Получить экземпляр EventEmitter
     */
    get eventEmitter(): EventEmitter {
        return this.events;
    }

    /**
     * Получить экземпляр API
     */
    get apiClient(): Api {
        return this.api;
    }
}