export class ShoppingCart {
  private _itemsContainer!: HTMLElement;
  private _totalAmountEl!: HTMLElement;
  private _checkoutButton!: HTMLButtonElement;

  set itemsContainer(container: HTMLElement) {
  this._itemsContainer = container;
}

  set selected(isSelected: boolean) {
    if (this._checkoutButton) {
      this._checkoutButton.disabled = !isSelected;
      this._checkoutButton.classList.toggle('disabled', !isSelected);
    }
  }

  set total(amount: number | string) {
    if (this._totalAmountEl) {
      this._totalAmountEl.textContent = `Итого: ${amount} ₽`;
    }
  }
}