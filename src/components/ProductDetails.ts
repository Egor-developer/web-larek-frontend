import { IProduct } from '../types/index';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class ProductDetails {
	private container: HTMLElement;
	private actionButton: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		this.container = container;
	}

	setProduct(
		product: IProduct,
		listPorduct: IProduct[],
		callback: (product: IProduct) => void
	): HTMLElement {
		ensureElement<HTMLImageElement>('.card__image', this.container).src =
			product.image;
		ensureElement<HTMLElement>('.card__title', this.container).textContent =
			product.title;
		ensureElement<HTMLElement>('.card__text', this.container).textContent =
			product.description;
		const price = ensureElement<HTMLElement>('.card__price', this.container);

		const category = ensureElement<HTMLElement>(
			'.card__category',
			this.container
		);
		category.textContent = product.category;
		category.classList.remove(
			'card__category_soft',
			'card__category_other',
			'card__category_additional',
			'card__category_button',
			'card__category_hard'
		);
		if (category.textContent === 'софт-скил') {
			category.classList.add('card__category_soft');
		} else if (category.textContent === 'другое') {
			category.classList.add('card__category_other');
		} else if (category.textContent === 'дополнительное') {
			category.classList.add('card__category_additional');
		} else if (category.textContent === 'кнопка') {
			category.classList.add('card__category_button');
		} else if (category.textContent === 'хард-скил') {
			category.classList.add('card__category_hard');
		}

		this.actionButton = ensureElement<HTMLElement>('.button', this.container);
		this.actionButton.onclick = () => callback(product);

		if (product.price === null) {
			price.textContent = 'Бесценно';
			this.actionButton.setAttribute('disabled', 'disabled');
		} else {
			this.actionButton.removeAttribute('disabled');
			price.textContent = `${product.price} синапсов`;
		}

		listPorduct.forEach((elem) => {
			if (elem === product) {
				this.actionButton.setAttribute('disabled', 'disabled');
			}
		});

		return this.container;
	}
}
