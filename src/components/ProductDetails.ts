import { IProduct } from '../types/index';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class ProductDetails {
  private container: HTMLElement;
  private actionButton: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    this.container = container;
  }

  setProduct(product: IProduct, callback: (product: IProduct) => void): HTMLElement {
    ensureElement<HTMLImageElement>('.card__image', this.container).src = product.image;
    ensureElement<HTMLElement>('.card__category', this.container).textContent = product.category;
    ensureElement<HTMLElement>('.card__title', this.container).textContent = product.title;
    ensureElement<HTMLElement>('.card__text', this.container).textContent = product.description;

    this.actionButton = ensureElement<HTMLElement>('.button', this.container);
    this.actionButton.onclick = () => callback(product);
    
    if (product.price === null) {
      ensureElement<HTMLElement>('.card__price', this.container).textContent = 'Бесценно'
      this.actionButton.setAttribute('disabled', 'disabled');
    } else {
      this.actionButton.removeAttribute('disabled');
      ensureElement<HTMLElement>('.card__price', this.container).textContent = `${product.price} синапсов`
    }

    return this.container;
  }
}
