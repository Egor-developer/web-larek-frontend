export class Form {
  protected _submit: HTMLButtonElement;
  protected _errors?: HTMLElement;

  constructor(submit: HTMLButtonElement, errors?: HTMLElement) {
    this._submit = submit;
    this._errors = errors;
  }

  onInputChange(event: Event): void {
    // Метод для обработки изменения поля ввода
  }

  set valid(isValid: boolean) {
    this._submit.disabled = !isValid;
  }

  set errors(errors: string | null) {
    if (this._errors) {
      this._errors.textContent = errors || '';
    }
  }

  render(): void {
    // Метод рендера формы (например, обновление состояния кнопки или ошибок)
  }
}
