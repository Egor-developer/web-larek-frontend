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

	getTotal(): number {
		return this.basketList.length;
	}

	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.events.emit('catalog:changed', this.catalog);
	}

	clearBasket() {
		this.basketList = [];
		this.events.emit('basket:changed', this.basketList);
	}

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

	addBasketList(item: IProduct) {
		if (!this.basketList.find((p) => p.id === item.id)) {
			this.basketList.push(item);
			this.events.emit('basket:changed', this.basketList);
		}
	}

	changeBasketList(id: string) {
		this.basketList = this.basketList.filter((p) => p.id !== id);
		this.events.emit('basket:changed', [...this.basketList]);
	}

	setOrderField(field: keyof IOrder, value: string | number | IProduct[]) {
		this.order[field] = value as never;
		this.events.emit('order:changed', this.order);
	}

	setContactsField(field: 'email' | 'phone', value: string) {
		this.order[field] = value;
		this.events.emit('order:changed', this.order);
	}

	validateOrder(): boolean {
		this.formErrors = {};

		if (!this.order.address?.trim()) {
			this.formErrors.address = 'Введите адрес доставки';
		}

		if (!this.order.payment) {
			this.formErrors.payment = 'Выберите способ оплаты';
		}

		return Object.keys(this.formErrors).length === 0;
	}

	validateContacts(): boolean {
		this.formErrors = {};

		if (!this.order.email || !this.order.email.trim()) {
			this.formErrors.email = 'Введите email';
		}

		if (!this.order.phone || !this.order.phone.trim()) {
			this.formErrors.phone = 'Введите номер телефона';
		}

		return Object.keys(this.formErrors).length === 0;
	}
}
