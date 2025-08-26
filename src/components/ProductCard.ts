import { IProduct } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

export class ProductCard {
	private _title: HTMLElement;
	private _price: HTMLElement;
	private _category: HTMLElement;
	private _image?: HTMLImageElement;
	private _button?: HTMLElement;
	index: number;
	template: HTMLElement;

	constructor(template: HTMLElement, protected events: IEvents) {
		this.template = template;
	}

	set id(id: number) {
		this.index = id;
	}

	render(data: IProduct): HTMLElement {
		const card = this.template.cloneNode(true) as HTMLElement;

		this._title = ensureElement<HTMLElement>('.card__title', card);
		this._price = ensureElement<HTMLElement>('.card__price', card);
		this._category = ensureElement<HTMLElement>('.card__category', card);
		this._image = ensureElement<HTMLImageElement>('.card__image', card);
		this._button = card;

		this._button.addEventListener('click', () => {
			this.events.emit('preview:changed', data);
		});

		this._title.textContent = data.title;
		this._price.textContent =
			data.price === null ? 'Бесценно' : `${data.price} синапсов`;
		this._category.textContent = data.category;
		this._image.src = data.image;

		return card;
	}
}
