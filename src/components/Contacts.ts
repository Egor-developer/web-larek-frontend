import { ensureAllElements, ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './Form';

export class Contacts extends Form {
	protected validateContactsFunction: () => boolean;

	constructor(
		protected events: IEvents,
		formErrors: Record<string, string> = {},
		validateContactsFunction: () => boolean
	) {
		const formContacts = ensureElement<HTMLElement>('#form-contacts');
		super(formContacts, formErrors);

		this.validateContactsFunction = validateContactsFunction;

		const inputs = ensureAllElements<HTMLInputElement>(
			'.form__input',
			this._form
		);

		inputs.forEach((input) =>
			input.addEventListener('input', (event: Event) =>
				this.onInputChange(event)
			)
		);

		this._form.addEventListener('submit', (e) => {
			e.preventDefault();
			if (!this.validateContactsFunction()) return;
			inputs.forEach((elem) => {
				elem.value = '';
			});
			this.errors = '';
			this._submit.setAttribute('disabled', 'disabled');
			this.events.emit('order:completed');
		});
	}

	onInputChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (!target) return;

		const { name, value } = target;

		if (name === 'phone') {
			this.events.emit('order:changed', { title: 'phone', value: value });
			this.errors = this.formErrors.phone;
		} else if (name === 'email') {
			this.events.emit('order:changed', { title: 'email', value: value });
			this.errors = this.formErrors.email;
		}
		this.renderButton();
	}

	renderButton() {
		if (this.validateContactsFunction()) {
			this._submit.removeAttribute('disabled');
		} else {
			this._submit.setAttribute('disabled', 'disabled');
		}
	}
}
