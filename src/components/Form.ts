import { ensureElement } from '../utils/utils';

export class Form {
	protected _form: HTMLElement;
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;
	appState;

	constructor(form: HTMLElement, appState: any) {
		this.appState = appState;
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
}
