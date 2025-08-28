import { ensureElement } from '../utils/utils';

export class Form {
	protected _form: HTMLElement;
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;
	protected formErrors: Record<string, string> = {};

	constructor(form: HTMLElement, formErrors: Record<string, string> = {}) {
		this.formErrors = formErrors;
		this._form = form;

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			this._form
		);
		this._errors = ensureElement<HTMLElement>('.error', this._form);
	}

	set errors(message: string | null) {
		this._errors.textContent = message || '';
	}

	get form(): HTMLElement {
		return this._form;
	}
}
