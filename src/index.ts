import { EventEmitter } from './components/EventEmitter';
import { ProductModel } from './components/ProductModel';
import { AppState } from './components/AppState';
import UIComponent from './components/UIComponent';
import { ProductCard } from './components/ProductCard';
import { PageLayout } from './components/PageLayout';
import { Form } from './components/Form';
import { ShoppingCart } from './components/ShoppingCart';
import { IProduct } from './types/index';

const events = new EventEmitter();

const appState = new AppState(events);

const pageLayout = new PageLayout(events);
const form = new Form(events);
const shoppingCart = new ShoppingCart(events);

events.on('catalog:changed', (catalog: IProduct[]) => {
  // Обновляет отображение карточек товаров в PageLayout
  // Отображает каждую карточку с помощью ProductCard
  const cards = catalog.map((item) => {
    const card = new ProductCard(events);
    return card.render(item);
  });
  pageLayout.renderCards(cards);
});

events.on('basket:changed', () => {
  // Обновляет список товаров в ShoppingCart
  shoppingCart.renderBasket(appState.basketList);
  // Обновляет сумму заказа
  shoppingCart.updateTotal();
  // Обновляет счётчик товаров в PageLayout
  pageLayout.updateCounter(appState.basketList.length);
});

events.on('order:changed', () => {
  // Обновляет форму заказа (Form)
  form.renderOrder(appState.order);
  // Контролирует активность кнопки оформления
  form.updateOrderButtonState();
});

events.on('contacts:changed', () => {
  // Обновляет форму контактов
  form.renderContacts(appState.contacts);
  // Проверяет валидность формы
  form.validate();
});

events.on('formErrors:changed', () => {
  // Обновляет визуальное отображение ошибок в Form
  form.renderErrors(appState.formErrors);
});

events.on('order:completed', () => {
  // Показывает SuccessModal с сообщением
  form.showSuccess();
  // Очищает корзину (clearBasket())
  appState.clearBasket();
  // Скрывает форму заказа
  form.hide();
});

events.on('preview:changed', (productId: string) => {
  // Показывает ProductDetails
  pageLayout.showProductDetails(productId);
  // Устанавливает данные для подробного просмотра
  pageLayout.setPreviewData(productId);
});
