import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { Modal } from './components/Modal';
import { AppState } from './components/AppState';
import { Contacts } from './components/Contacts';
import { ProductCard } from './components/ProductCard';
import { CartItem } from './components/CartItem';
import { ProductDetails } from './components/ProductDetails';
import { SuccessModal } from './components/SuccessModal';
import { PageLayout } from './components/PageLayout';
import { Api } from './components/base/api';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';
import { IProduct, IOrder } from './types/index';
import { Order } from './components/Order';

const api = new Api(API_URL);
const events = new EventEmitter();
const appState = new AppState(events);
const modal = new Modal(events);

const catalogCardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cloneCatalogCardTemplate = cloneTemplate(catalogCardTemplate);
const productCard = new ProductCard(cloneCatalogCardTemplate, events);
const previewCardTemplate = ensureElement<HTMLTemplateElement>(
	'#card-preview-modal'
);
const productDetails = new ProductDetails(previewCardTemplate, events);
const pageLayout = new PageLayout(events, modal);

events.on('catalog:changed', (catalog: IProduct[]) => {
	catalog.map((item) => {
		pageLayout.addToCatalog(
			productCard.render({ ...item, image: CDN_URL + item.image })
		);
	});
});

events.on('modal:open', () => {
	pageLayout.locked = true;
});

events.on('modal:close', () => {
	pageLayout.locked = false;
});

events.on('preview:changed', (product: IProduct) => {
	modal.renderModal(
		productDetails.setProduct(product, (p) => appState.addBasketList(p))
	);
});

events.on('basket:changed', (data: IProduct) => {
	if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
		appState.basketList.push(data);
	}

	const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
	const basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
	const basketContainer = ensureElement<HTMLElement>('.basket__list');
	const basketPrice = ensureElement<HTMLElement>('.basket__price');
	const basketPlace = ensureElement<HTMLElement>('.button__place');

	basketContainer.innerHTML = '';

	if (Array.isArray(data) && data.length === 0) {
		basketPlace.setAttribute('disabled', 'disabled');
		basketContainer.textContent = 'Корзина пуста';
	} else if (new CartItem().getTotalPrice(appState.basketList) === 0) {
		basketPlace.setAttribute('disabled', 'disabled');
	} else {
		basketPlace.removeAttribute('disabled');
	}

	appState.basketList.forEach((item, index) => {
		const card = new CartItem();
		const clone = cloneTemplate(cardBasketTemplate);

		card.updateQuantity(index + 1);

		const productElement = card.setProduct(item, clone, (id) =>
			appState.changeBasketList(id)
		);

		basketContainer.appendChild(productElement);
	});

	basketPrice.textContent = `${new CartItem().getTotalPrice(
		appState.basketList
	)} синапсов`;
	pageLayout.counter = appState.getTotal();
	basketCounter.textContent = String(pageLayout.counter);
});

events.on('order:open', () => {
	const formOrder = ensureElement<HTMLElement>('#form-order');
	modal.renderModal(formOrder)
	new Order(formOrder, events, appState);
});

events.on('order:changed', () => {
	appState.order.items = appState.basketList.map((item) => item.id);
	const total = new CartItem().getTotalPrice(appState.basketList);
	appState.order.total = total;
});

events.on('contacts:open', () => {
	modal.closeModal()
	const formContacts = ensureElement<HTMLElement>('#form-contacts');
	modal.renderModal(formContacts)
	new Contacts(formContacts, events, appState);
});

events.on('order:completed', () => {
	modal.closeModal()
	api
		.post<IOrder>('/order', appState.order)
		.then((order) => {
			modal.renderModal(new SuccessModal(order.total, modal).container)
		})
		.catch(console.error);
	appState.clearBasket();
	appState.clearOrder();
});

type Product = {
	total: number;
	items: Array<any>;
};

api
	.get<Product>('/product')
	.then((res) => {
		appState.setCatalog(res.items);
	})
	.catch(console.error);
