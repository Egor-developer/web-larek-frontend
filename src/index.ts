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
import { IProduct, IFullOrder, IOrder } from './types/index';
import { Order } from './components/Order';
import { Basket } from './components/Basket';

const api = new Api(API_URL);
const events = new EventEmitter();
const appState = new AppState(events);
const modal = new Modal(events);
const successModal = new SuccessModal(modal);
const basket = new Basket();
const oreder = new Order(events, appState.formErrors, () =>
	appState.validateOrder()
);
const contacts = new Contacts(events, appState.formErrors, () =>
	appState.validateContacts()
);

const catalogCardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cloneCatalogCardTemplate = cloneTemplate(catalogCardTemplate);
const productCard = new ProductCard(cloneCatalogCardTemplate, events);
const previewCardTemplate = ensureElement<HTMLTemplateElement>(
	'#card-preview-modal'
);
const productDetails = new ProductDetails(previewCardTemplate, events);
const pageLayout = new PageLayout(events, modal);

let fullOrder: IFullOrder = {};

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
		productDetails.setProduct(product, appState.basketList, (p) =>
			appState.addBasketList(p)
		)
	);
});

events.on('basket:changed', (data: IProduct[]) => {
	if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
		appState.basketList.push(data);
	}
	pageLayout.counter = appState.getTotal();
	basket.render(
		appState.basketList,
		String(pageLayout.counter),
		new CartItem(),
		(id) => appState.changeBasketList(id)
	);
});

events.on('order:open', () => {
	modal.renderModal(oreder.form);
});

events.on('order:changed', (data: { title: keyof IOrder; value: string }) => {
	appState.setOrderField(data.title, data.value);
});

events.on('contacts:open', () => {
	modal.closeModal();
	modal.renderModal(contacts.form);
});

events.on('order:completed', () => {
	fullOrder = appState.order;
	fullOrder.items = appState.basketList.map((item) => item.id);
	fullOrder.total = new CartItem().getTotalPrice(appState.basketList);
	api
		.post<IFullOrder>('/order', fullOrder)
		.then((order) => {
			modal.closeModal();
			appState.clearBasket();
			appState.clearOrder();
			modal.renderModal(successModal.render(order.total));
		})
		.catch(console.error);
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
