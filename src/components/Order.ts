import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './Form';

export class Order extends Form {
	private _paymentCard: HTMLButtonElement;
	private _paymentCash: HTMLButtonElement;
	private _selectedMethod: 'card' | 'cash' | null = null;

	constructor(form: HTMLElement, protected events: IEvents, appState: any) {
		super(form, appState);

		const input = ensureElement<HTMLInputElement>('.form__input', this._form);

		this._paymentCard = ensureElement<HTMLButtonElement>(
			'.button_card',
			this._form
		);
		this._paymentCash = ensureElement<HTMLButtonElement>(
			'.button_cash',
			this._form
		);

		input.addEventListener('input', (event: Event) => {
			this.onInputChange(event);
		});

		this._paymentCard.addEventListener('click', () =>
			this.selectPayment('card')
		);
		this._paymentCash.addEventListener('click', () =>
			this.selectPayment('cash')
		);

		input.addEventListener('input', (event: Event) => {
			this.onInputChange(event);
		});

		this._form.addEventListener('submit', (e) => {
			e.preventDefault();
			if (!this.appState.validateOrder()) return;
			input.value = '';
			this.errors = '';
			this._paymentCard.classList.remove('button_alt-active');
			this._paymentCash.classList.remove('button_alt-active');
			this._submit.setAttribute('disabled', 'disabled');
			this.events.emit('contacts:open');
		});
	}

	onInputChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (!target) return;

		this.errors = this.appState.formErrors.address;

		this.appState.setOrderField('address', target.value);
		this.renderButton();
	}

	private selectPayment(method: 'card' | 'cash') {
		this._selectedMethod = method;
		this.errors = this.appState.formErrors.method;
		this.appState.setOrderField('payment', method);
		this.renderButton();

		this._paymentCard.classList.remove('button_alt-active');
		this._paymentCash.classList.remove('button_alt-active');

		if (method === 'card') {
			this._paymentCard.classList.add('button_alt-active');
		} else {
			this._paymentCash.classList.add('button_alt-active');
		}
	}

	renderButton() {
		if (this.appState.validateOrder()) {
			this._submit.removeAttribute('disabled');
		} else {
			this._submit.setAttribute('disabled', 'disabled');
		}
	}
}
