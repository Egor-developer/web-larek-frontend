import { IProduct } from '../types/index';

export class ProductDetails {
  private container: HTMLElement;
  private closeButton?: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  setProduct(product: IProduct): void {
    this.container.innerHTML = `
      <h2>${product.title}</h2>
      ${product.image ? `<img src="${product.image}" alt="${product.title}" />` : ''}
      <p>Цена: ${product.price !== null ? product.price : 'нет данных'}</p>
      <p>Категория: ${product.category ?? 'нет данных'}</p>
      ${product.description ? `<p>${product.description}</p>` : ''}
    `;
  }

  hide(): void {
    this.container.style.display = 'none';
  }

  setCloseButton(callback: () => void): void {
    if (!this.closeButton) {
      this.closeButton = document.createElement('button');
      this.closeButton.textContent = 'Закрыть';
      this.container.appendChild(this.closeButton);
    }
    this.closeButton.onclick = callback;
  }
}
