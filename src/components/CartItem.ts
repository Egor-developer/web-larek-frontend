import { IProduct } from '../types/index';
import { ensureElement } from '../utils/utils';

export class CartItem {
  private quantity = 1;

  setProduct(product: IProduct, container: HTMLElement, callback: (id: string) => void) {
    ensureElement<HTMLElement>('.card__title', container).textContent = product.title
    ensureElement<HTMLElement>('.card__price', container).textContent = product.price === null ? 'Бесценно' : `${product.price} синапсов`;
    ensureElement<HTMLElement>('.basket__item-index', container).textContent = String(this.quantity)

    ensureElement<HTMLElement>('.basket__item-delete', container).addEventListener('click', () => callback(product.id))

    return container
  }

  updateQuantity(count: number): void {
    this.quantity = count;
  }

  getTotalPrice(list: IProduct[]) {
    const total = list.reduce((sum, item) => sum + item.price, 0);
    return total
  }
}
