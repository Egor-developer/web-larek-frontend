import {
  IProduct,
  IOrderForm,
} from '../types';

import { IEvents } from './base/events';

export class AppState {
  catalog: IProduct[] = [];
  preview: string | null = null;
  basket: {
    items: string[];
    total: number;
  } = {
    items: [],
    total: 0,
  };

  order: IOrderForm = {
    email: '',
    phone: '',
    address: '',
    payment: undefined,
    total: undefined,
  };

  formErrors: { [key in keyof IOrderForm]?: string } = {};

  constructor(protected events: IEvents) {}

  setItems(items: IProduct[]) {
    this.catalog = items;
    this.events.emit('items:changed', this.catalog);
  }

  setPreview(item: IProduct) {
    this.preview = item.id;
    this.events.emit('preview:changed', { preview: item.id });
  }

  addToBasket(item: IProduct) {
    if (!this.basket.items.includes(item.id)) {
      this.basket.items.push(item.id);
      this.basket.total += item.price ?? 0;
      this.events.emit('basket:changed', this.basket);
    }
  }

  inBasket(item: IProduct) {
    return this.basket.items.includes(item.id);
  }

  removeFromBasket(item: IProduct) {
    this.basket.items = this.basket.items.filter((id) => id !== item.id);
    this.basket.total -= item.price ?? 0;
    this.events.emit('basket:changed', this.basket);
  }

  clearBasket() {
    this.basket.items = [];
    this.basket.total = 0;
    this.events.emit('basket:changed', this.basket);
  }

  setPayment(method: string) {
    this.order.payment = method;
  }

  setOrderField(field: keyof IOrderForm, value: string | number) {
    if (field === 'payment') {
      this.order.payment = value as string;
    } else if (field === 'total') {
      this.order.total = value;
    } else {
      this.order[field] = value as string;
    }
  }

  setFormError(field: keyof IOrderForm, error: string) {
    this.formErrors[field] = error;
    this.events.emit('form:error', { field, error });
  }

  validateContacts(): boolean {
    this.formErrors = {};

    if (!this.order.email?.trim()) {
      this.formErrors.email = 'Введите email';
    } else if (!/^\S+@\S+\.\S+$/.test(this.order.email)) {
      this.formErrors.email = 'Некорректный email';
    }

    if (!this.order.phone?.trim()) {
      this.formErrors.phone = 'Введите номер телефона';
    } else if (!/^\+?\d{10,15}$/.test(this.order.phone)) {
      this.formErrors.phone = 'Некорректный номер телефона';
    }

    return Object.keys(this.formErrors).length === 0;
  }

  validateOrder(): boolean {
    this.formErrors = {};

    if (!this.order.address?.trim()) {
      this.formErrors.address = 'Введите адрес доставки';
    }

    if (!this.order.payment) {
      this.formErrors.payment = 'Выберите способ оплаты';
    }

    Object.entries(this.formErrors).forEach(([field, error]) => {
      this.events.emit('form:error', { field, error });
    });

    return Object.keys(this.formErrors).length === 0;
  }
}
