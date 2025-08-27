import { IProduct } from '../types';
import { cloneTemplate, ensureElement } from '../utils/utils';

export class Basket {
	cardBasketTemplate: HTMLTemplateElement;
	basketCounter: HTMLElement;
	basketContainer: HTMLElement;
	basketPrice: HTMLElement;
	basketPlace: HTMLElement;
	list: IProduct[];

	constructor() {
		this.cardBasketTemplate =
			ensureElement<HTMLTemplateElement>('#card-basket');
		this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
		this.basketContainer = ensureElement<HTMLElement>('.basket__list');
		this.basketPrice = ensureElement<HTMLElement>('.basket__price');
		this.basketPlace = ensureElement<HTMLElement>('.button__place');
	}

	render(
		data: IProduct[],
		total: string,
		cartItem: any,
		callback: (id: string) => void
	) {
		this.list = data;
		if (this.list.length !== 0) {
			this.basketContainer.innerHTML = '';
		}

		if (Array.isArray(this.list) && this.list.length === 0) {
			this.basketPlace.setAttribute('disabled', 'disabled');
			this.basketContainer.textContent = 'Корзина пуста';
		} else if (cartItem.getTotalPrice(this.list) === 0) {
			this.basketPlace.setAttribute('disabled', 'disabled');
		} else {
			this.basketPlace.removeAttribute('disabled');
		}

		this.list.forEach((item, index) => {
      const cloneCardBasketTemplate = cloneTemplate(this.cardBasketTemplate)

      cartItem.updateQuantity(index + 1);

			const productElement = cartItem.setProduct(
				item,
				cloneCardBasketTemplate,
				(id: string) => callback(id)
			);

			this.basketContainer.appendChild(productElement);
		});

		this.basketPrice.textContent = `${cartItem.getTotalPrice(
			this.list
		)} синапсов`;
		this.basketCounter.textContent = total;

		return this.cardBasketTemplate;
	}
}
