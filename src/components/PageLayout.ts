import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class PageLayout {
	private _catalog: HTMLElement;
	private _wrapper: HTMLElement;
	private _basketButton: HTMLElement;
	private _buttonPlace: HTMLElement;
	private _counter: number;

	constructor(protected events: IEvents, modal: any) {
		const basketModal = ensureElement<HTMLTemplateElement>('#basket-modal');
		this._buttonPlace = ensureElement('.button__place', basketModal);

		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._basketButton = ensureElement<HTMLElement>('.header__basket');

		this._basketButton.addEventListener('click', () => {
			modal.renderModal(basketModal);
		});

		this._buttonPlace.addEventListener('click', () => {
			modal.closeModal()
			this.events.emit('order:open');
		});
	}

	get counter(): number {
		return this._counter;
	}

	set counter(value: number) {
		this._counter = value;
	}

	set locked(value: boolean) {
		value
			? this._wrapper.classList.add('page__wrapper_locked')
			: this._wrapper.classList.remove('page__wrapper_locked');
	}

	addToCatalog(element: HTMLElement) {
		this._catalog.appendChild(element);
	}
}
