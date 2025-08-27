import { ensureAllElements, ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './Form';

export class Contacts extends Form {
	constructor(protected events: IEvents, appState: any) {
		const formContacts = ensureElement<HTMLElement>('#form-contacts');
		super(formContacts, appState);

		const inputs = ensureAllElements<HTMLInputElement>('.form__input', this._form)

		inputs.forEach((input) =>
				input.addEventListener('input', (event: Event) =>
	  			this.onInputChange(event)
				)
			);

		this._form.addEventListener('submit', (e) => {
			e.preventDefault();
			if (!this.appState.validateContacts()) return
      inputs.forEach((elem) => {
        elem.value = ''
      })
      this.errors = ''
      this._submit.setAttribute('disabled', 'disabled');
			this.events.emit('order:completed');
		});
	}

	onInputChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (!target) return;

		const { name, value } = target;

		if (name === 'phone') {
			this.appState.setContactsField('phone', value);
			this.errors = this.appState.formErrors.phone
		} else if (name === 'email') {
			this.appState.setContactsField('email', value);
			this.errors = this.appState.formErrors.email
		}
		this.renderButton()
	}

	renderButton() {
		if (this.appState.validateContacts()) {
			this._submit.removeAttribute('disabled');
		} else {
			this._submit.setAttribute('disabled', 'disabled');
		}
	}
}
