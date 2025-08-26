import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";

export class Modal {
  private _closeButton: HTMLElement;
  private _content: HTMLElement;
  private outsideClickHandler: (event: MouseEvent) => void;

  constructor(protected events: IEvents) {
    this.events = events
  }

  private handleOutsideClick(event: MouseEvent) {
		const modalContent = ensureElement<HTMLElement>('.modal__container', this._content);
		if (!modalContent.contains(event.target as Node)) {
			this.closeModal();
		}
	}

  openModal() {
    this._content.classList.add('modal_active');
    this.events.emit('modal:open');

    setTimeout(() => {
			document.addEventListener('click', this.outsideClickHandler);
		}, 0);
  }

  closeModal() {
    this._content.classList.remove('modal_active');
    this.events.emit('modal:close');

    document.removeEventListener('click', this.outsideClickHandler);
  }

  renderModal(content: HTMLElement): void {
    this._content = content

    this._closeButton = ensureElement<HTMLElement>('.modal__close', this._content);
		this._closeButton.addEventListener('click', () => this.closeModal());
    this.outsideClickHandler = this.handleOutsideClick.bind(this);

    this.openModal()
  }
}
