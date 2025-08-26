import { ensureElement } from "../utils/utils";

export class SuccessModal {
  container: HTMLElement

  constructor(total: string | number, modal: any) {
    this.container = document.querySelector('#success-modal')

    const description = ensureElement<HTMLElement>('.film__description', this.container)
    description.textContent = `Списано ${total} синапсов`

    ensureElement<HTMLButtonElement>('.order-success__close', this.container).addEventListener('click', () => modal.closeModal());
  }
}