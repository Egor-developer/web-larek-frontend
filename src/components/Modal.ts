export class Modal {
  private _closeButton: HTMLButtonElement;
  private _content: HTMLElement;

  constructor(closeButton: HTMLButtonElement, content: HTMLElement) {
    this._closeButton = closeButton;
    this._content = content;
  }

  set content(data: HTMLElement) {
    this._content = data;
  }

  openModal(): void {
    // реализация открытия модального окна
  }

  closeModal(): void {
    // реализация закрытия модального окна
  }

  renderModal(): void {
    // реализация рендера модального окна
  }
}
