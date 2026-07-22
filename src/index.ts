import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { ProductData } from './components/models/ProductData';
import { CartItem } from './components/models/CartItem';
import { OrderData } from './components/models/OrderData';
import { IProduct, IOrder } from './types';
import { Card } from './components/view/Card';
import { Page } from './components/view/Page';
import { Modal } from './components/view/common/Modal';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { Basket } from './components/view/Basket';
import { OrderForm } from './components/view/OrderForm';
import { Contacts } from './components/view/Contacts';
import { Success } from './components/view/common/Success';
import { cloneTemplate } from './utils/utils';

type InputChangeEvent = {
    field: keyof IOrder;
    value: string;
};

type PaymentToggleEvent = {
    payment: 'online' | 'cash';
};

const events = new EventEmitter();
const api = new LarekApi(API_URL);

const productData = new ProductData(events);
const cartItem = new CartItem(events);
const orderData = new OrderData(events);

const page = new Page(document.querySelector('.page')!, events);
const modal = new Modal(document.querySelector('#modal-container')!, events);

const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basketContainer = cloneTemplate<HTMLElement>(basketTemplate);
const basket = new Basket(basketContainer, events);

const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const orderContainer = cloneTemplate<HTMLFormElement>(orderTemplate);
const orderForm = new OrderForm(orderContainer, events);

const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const contactsContainer = cloneTemplate<HTMLFormElement>(contactsTemplate);
const contactsForm = new Contacts(contactsContainer, events);

const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
const successContainer = cloneTemplate<HTMLElement>(successTemplate);
const success = new Success(successContainer, events);

let currentForm: 'order' | 'contacts' | null = null;

function validateOrderForm(): boolean {
    const hasPaymentError = !orderData.payment;
    const hasAddressError = !orderData.address;
    const hasErrors = hasPaymentError || hasAddressError;
    
    orderForm.valid = !hasErrors;
    
    if (hasPaymentError && hasAddressError) {
        orderForm.errors = 'Выберите способ оплаты и укажите адрес';
    } else if (hasPaymentError) {
        orderForm.errors = 'Выберите способ оплаты';
    } else if (hasAddressError) {
        orderForm.errors = 'Укажите адрес доставки';
    } else {
        orderForm.errors = '';
    }
    
    return !hasErrors;
}

function validateContactsForm(): boolean {
    const hasEmailError = !orderData.email;
    const hasPhoneError = !orderData.phone;
    const hasErrors = hasEmailError || hasPhoneError;
    
    contactsForm.valid = !hasErrors;
    
    if (hasEmailError && hasPhoneError) {
        contactsForm.errors = 'Укажите email и телефон';
    } else if (hasEmailError) {
        contactsForm.errors = 'Укажите email';
    } else if (hasPhoneError) {
        contactsForm.errors = 'Укажите телефон';
    } else {
        contactsForm.errors = '';
    }
    
    return !hasErrors;
}

function prepareContactsForm(): void {
    contactsForm.email = orderData.email;
    contactsForm.phone = orderData.phone;
    validateContactsForm();
}

function updateBasket(): void {
    const items = cartItem.getItems();
    const total = cartItem.getTotal();
    
    const cards = items.map((item, index) => {
        const cardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
        const cardElement = cloneTemplate<HTMLElement>(cardTemplate);
        const card = new Card(cardElement, events, {
            onClick: () => {},
            onAddToCart: () => {
                cartItem.remove(item.id);
                updateBasket();
                updateCatalog();
            }
        });
        card.title = item.title;
        card.price = item.price;
        card.index = index + 1;
        return cardElement;
    });
    
    basket.items = cards;
    basket.total = total;

    const content = modal['_content'];
    if (content && content.querySelector('.basket')) {
        modal.content = basketContainer;
    }
}

function updateCatalog(): void {
    const products = productData.catalog;
    if (products && products.length > 0) {
        const cards = products.map(p => createCard(p));
        page.catalog = cards;
    }
    page.counter = cartItem.getCount();
}

events.on<InputChangeEvent>('input:change', ({ field, value }) => {
    orderData.setField(field, value);
    
    if (currentForm === 'order') {
        validateOrderForm();
    } else if (currentForm === 'contacts') {
        validateContactsForm();
    }
});

events.on<PaymentToggleEvent>('payment:toggle', ({ payment }) => {
    orderData.setField('payment', payment);
    orderForm.toggleButtons(payment);
    if (currentForm === 'order') {
        validateOrderForm();
    }
});

events.on('basket:open', () => {
    updateBasket();
    modal.content = basketContainer;
    modal.open();
});

events.on('basket:changed', () => {
    updateCatalog();
    const content = modal['_content'];
    if (content && content.querySelector('.basket')) {
        updateBasket();
    }
});

events.on('order:open', () => {
    currentForm = 'order';
    orderForm.address = orderData.address;
    if (orderData.payment) {
        orderForm.toggleButtons(orderData.payment);
    }
    validateOrderForm();
    modal.content = orderContainer;
    modal.open();
});

events.on('order:submit', () => {
    if (!validateOrderForm()) {
        return;
    }
    
    currentForm = 'contacts';
    orderForm.valid = true;
    orderForm.errors = '';
    prepareContactsForm();
    modal.content = contactsContainer;
    modal.open();
});

events.on('contacts:submit', () => {
    if (!validateContactsForm()) {
        return;
    }
    
    contactsForm.valid = true;
    contactsForm.errors = '';
    
    const order = {
        ...orderData.getOrderData(),
        total: cartItem.getTotal(),
        items: cartItem.getItems().map(item => item.id)
    };
    
    api.orderProducts(order)
        .then(result => {
            cartItem.clear();
            orderData.setField('payment', '');
            orderData.setField('address', '');
            orderData.setField('email', '');
            orderData.setField('phone', '');
            updateCatalog();
            success.total = result.total;
            currentForm = null;
            modal.content = successContainer;
            modal.open();
        })
        .catch(error => {
            console.error('Ошибка оформления заказа:', error);
            contactsForm.errors = 'Ошибка оформления заказа. Попробуйте позже.';
            contactsForm.valid = false;
        });
});

events.on('success:close', () => {
    currentForm = null;
    modal.close();
});

function createCard(product: IProduct): HTMLElement {
    const template = document.querySelector('#card-catalog') as HTMLTemplateElement;
    const cardElement = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    
    const card = new Card(cardElement, events, {
        onClick: () => {
            openPreview(product);
        }
    });
    
    updateCardState(card, product);
    return cardElement;
}

function updateCardState(card: Card, product: IProduct): void {
    card.title = product.title;
    card.price = product.price;
    card.image = product.image;
    card.category = product.category;
    card.inCart = cartItem.isInCart(product.id);
}

function openPreview(product: IProduct): void {
    const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
    const previewElement = previewTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const previewCard = new Card(previewElement, events, {
        onClick: () => {},
        onAddToCart: () => {
            if (cartItem.isInCart(product.id)) {
                cartItem.remove(product.id);
            } else {
                cartItem.add(product);
            }
            modal.close();
        }
    });
    
    updateCardState(previewCard, product);
    modal.content = previewElement;
    modal.open();
}

events.on<IProduct[]>('items:changed', (products) => {
    const cards = products.map(p => createCard(p));
    page.catalog = cards;
});

events.on('basket:changed', () => {
    page.counter = cartItem.getCount();
    const products = productData.catalog;
    if (products && products.length > 0) {
        const cards = products.map(p => createCard(p));
        page.catalog = cards;
    }
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

api.getProducts()
    .then((products: IProduct[]) => {
        const productsWithImages = products.map(product => ({
            ...product,
            image: `${CDN_URL}${product.image}`
        }));
        productData.setCatalog(productsWithImages);
    })
    .catch((error: Error) => {
        console.error('Ошибка загрузки товаров:', error);
        const message = document.createElement('p');
        message.textContent = 'Не удалось загрузить товары. Проверьте соединение с сервером.';
        page.catalog = [message];
    });