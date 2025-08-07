import { IProduct } from '../types/index';

export class CartItem {
  private product: IProduct | null = null;
  private quantity = 1;
  private removeCallback: (() => void) | null = null;

  setProduct(product: IProduct): void {
    this.product = product;
    // отрисовка карточки товара в корзине
  }

  setRemoveButton(callback: () => void): void {
    this.removeCallback = callback;
    // установка обработчика удаления товара
  }

  updateQuantity(count: number): void {
    this.quantity = count;
    // обновление количества товара
  }

  getTotalPrice(): number {
    if (!this.product || this.product.price === null) {
      return 0;
    }
    return this.product.price * this.quantity;
  }
}
