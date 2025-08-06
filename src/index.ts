import './scss/styles.scss';

import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/AppState';
import {
  IProduct,
  IOrderForm,
  IOrder,
} from './types';
import { CardMain } from './components/CardMain';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { CardPreview } from './components/CardPreview';
import { Basket } from './components/Basket';
import { CardBasket } from './components/CardBasket';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';

const events = new EventEmitter();

const api = new LarekApi(CDN_URL, API_URL);
const appData = new AppState(events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderView = new Order(cloneTemplate(orderTemplate), events);
const contactsView = new Contacts(cloneTemplate(contactsTemplate), events);
const successView = new Success(cloneTemplate(successTemplate), {
  onClick: () => modal.close(),
});

events.on('items:changed', (items: IProduct[]) => {
  page.catalog = items.map((item) => {
    const card = new CardMain(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('preview:changed', item),
    });
    return card.render(item);
  });
});

events.on('preview:changed', (item: IProduct) => {
  const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      appData.addToBasket(item);
    },
  });
  cardPreview.button = 'В корзину';
  modal.render({ content: cardPreview.render(item) });
});

events.on('basket:open', () => {
  modal.render({
    content: basketView.render(),
  });
});

events.on('basket:close', () => {
  modal.close();
});

events.on('basket:changed', () => {
  const basketItems = appData.catalog.filter((product) =>
    appData.basket.items.includes(product.id)
  );

  const basketCards = basketItems.map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onDelete: () => appData.removeFromBasket(item),
    });
    card.index = index + 1;
    return card.render(item);
  });

  basketView.items = basketCards;
  basketView.total = appData.basket.total;
  page.counter = appData.basket.items.length;
});

events.on('order:open', () => {
  modal.render({
    content: orderView.render({
      payment: 'card',
      address: '',
      valid: false,
      errors: '',
    }),
  });
});

events.on(/^order\..*:change$/, (data: { field: string; value: string }) => {
  appData.setOrderField(data.field as keyof IOrderForm, data.value);
  const valid = appData.validateOrder();
  orderView.valid = valid;
  orderView.errors = Object.values(appData.formErrors).join('; ');
});

events.on('order:submit', () => {
  const isValid = appData.validateOrder();
  if (isValid) {
    modal.render({
      content: contactsView.render({
        email: appData.order.email,
        phone: appData.order.phone,
        valid: false,
        errors: '',
      }),
    });
  }
});

events.on(/^contacts\..*:change$/, (data: { field: string; value: string }) => {
  appData.setOrderField(data.field as keyof IOrderForm, data.value);
  const valid = appData.validateContacts();
  contactsView.valid = valid;
  contactsView.errors = Object.values(appData.formErrors).join('; ');
});

events.on('contacts:submit', () => {
  const isValid = appData.validateContacts() && appData.validateOrder();

  appData.setOrderField('total', appData.basket.total);

  if (isValid) {
    const order: IOrder = {
      ...appData.order,
      items: appData.basket.items,
    };

    api
      .orderProduct(order)
      .then((result) => {
        appData.clearBasket();
        successView.total = result.total;
        modal.render({
          content: successView.render(),
        });
      })
      .catch(console.error);
  }
});

events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});

api
  .getProductList()
  .then(appData.setItems.bind(appData))
  .catch((err) => {
    console.error(err);
  });
