class UIComponent {
  protected element: HTMLElement;

  constructor(tagName: keyof HTMLElementTagNameMap = 'div') {
    this.element = document.createElement(tagName);
  }

  // Переключает CSS-класс у элемента
  toggleClass(className: string): void {
    this.element.classList.toggle(className);
  }

  // Устанавливает текстовое содержимое элемента
  setTextContent(text: string): void {
    this.element.textContent = text;
  }

  // Устанавливает состояние disabled для элемента, если это возможно
  setDisabledState(isDisabled: boolean): void {
    if ('disabled' in this.element) {
      (this.element as HTMLButtonElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).disabled = isDisabled;
    }
  }

  // Скрывает элемент
  hide(): void {
    this.element.style.display = 'none';
  }

  // Показывает элемент (сбрасывает display)
  show(): void {
    this.element.style.display = '';
  }

  // Устанавливает src и alt для изображения
  setImageAttributes(src: string, alt: string): void {
    if (this.element instanceof HTMLImageElement) {
      this.element.src = src;
      this.element.alt = alt;
    }
  }

  // Возвращает элемент для добавления в DOM
  render(): HTMLElement {
    return this.element;
  }
}

export default UIComponent;
