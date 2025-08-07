import { IProduct, IOrder, FormErrors } from '../types';
import { IEvents } from './base/events';

export class AppState {
  catalog: IProduct[] = [];
  basketList: IProduct[] = [];
  order: IOrder = {
    email: '',
    phone: '',
    address: '',
    payment: undefined,
    total: undefined,
    items: [],
  };
  formErrors: FormErrors = {};

  constructor(protected events: IEvents) {}

  // Количество товаров в корзине
  getTotal(): number {
    return this.basketList.length;
  }

  // Общая сумма товаров в корзине
  getTotalPrice(): number {
    return this.basketList.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  // Установить список товаров
  setCatalog(items: IProduct[]) {
    this.catalog = items;
    this.events.emit('catalog:changed', this.catalog);
  }

  // Очистить корзину
  clearBasket() {
    this.basketList = [];
    this.events.emit('basket:changed', this.basketList);
  }

  // Очистить заказ
  clearOrder() {
    this.order = {
      email: '',
      phone: '',
      address: '',
      payment: undefined,
      total: undefined,
      items: [],
    };
    this.formErrors = {};
    this.events.emit('order:changed', this.order);
  }

  // Добавить товар в корзину
  addBasketList(item: IProduct) {
    if (!this.basketList.find(p => p.id === item.id)) {
      this.basketList.push(item);
      this.events.emit('basket:changed', this.basketList);
    }
  }

  // Удалить товар из корзины по id
  changeBasketList(id: string) {
    this.basketList = this.basketList.filter(p => p.id !== id);
    this.events.emit('basket:changed', this.basketList);
  }

  // Установить поле заказа (например, адрес или способ оплаты)
  setOrderField(field: keyof IOrder, value: string | number) {
    this.order[field] = value as never;
    this.events.emit('order:changed', this.order);
  }

  // Установить поле контактов (например, email или телефон)
  setContactsField(field: 'email' | 'phone', value: string) {
  this.order[field] = value;
  this.events.emit('order:changed', this.order);
}

  // Валидация данных заказа
  validateOrder(): boolean {
    this.formErrors = {};

    if (!this.order.address?.trim()) {
      this.formErrors.address = 'Введите адрес доставки';
    }

    if (!this.order.payment) {
      this.formErrors.payment = 'Выберите способ оплаты';
    }

    this.emitFormErrors();
    return Object.keys(this.formErrors).length === 0;
  }

  // Валидация контактов
  validateContacts(): boolean {
  this.formErrors = {};

  // Проверка email
  if (!this.order.email || !this.order.email.trim()) {
    this.formErrors.email = 'Введите email';
  } else if (!/^\S+@\S+\.\S+$/.test(this.order.email.trim())) {
    this.formErrors.email = 'Некорректный email';
  }

  // Проверка телефона
  if (!this.order.phone || !this.order.phone.trim()) {
    this.formErrors.phone = 'Введите номер телефона';
  } else if (!/^\+?\d{10,15}$/.test(this.order.phone.trim())) {
    this.formErrors.phone = 'Некорректный номер телефона';
  }

  this.emitFormErrors();

  return Object.keys(this.formErrors).length === 0;
}

  // Отправить ошибки формы через события
  private emitFormErrors() {
    Object.entries(this.formErrors).forEach(([field, error]) => {
      this.events.emit('form:error', { field, error });
    });
  }
}
