import { ensureElement } from "../utils/utils";

export class SuccessModal {
  container: HTMLElement
  description: HTMLElement

  constructor(modal: any) {
    this.container = ensureElement<HTMLElement>('#success-modal')
    this.description = ensureElement<HTMLElement>('.film__description', this.container)


    ensureElement<HTMLButtonElement>('.order-success__close', this.container).addEventListener('click', () => modal.closeModal());
  }

  render(total: string | number) {
    this.description.textContent = `Списано ${total} синапсов`
    return this.container
  }
}