export class SuccessModal {
  private modalElement: HTMLElement | null = null;
  private autoCloseTimeoutId: number | null = null;

  constructor() {
    this.modalElement = document.createElement('div');
    this.modalElement.style.position = 'fixed';
    this.modalElement.style.top = '50%';
    this.modalElement.style.left = '50%';
    this.modalElement.style.transform = 'translate(-50%, -50%)';
    this.modalElement.style.padding = '20px';
    this.modalElement.style.backgroundColor = '#d4edda';
    this.modalElement.style.color = '#155724';
    this.modalElement.style.border = '1px solid #c3e6cb';
    this.modalElement.style.borderRadius = '4px';
    this.modalElement.style.display = 'none';
    document.body.appendChild(this.modalElement);
  }

  show(message: string): void {
    if (!this.modalElement) return;
    this.modalElement.textContent = message;
    this.modalElement.style.display = 'block';
  }

  hide(): void {
    if (!this.modalElement) return;
    this.modalElement.style.display = 'none';
    if (this.autoCloseTimeoutId) {
      clearTimeout(this.autoCloseTimeoutId);
      this.autoCloseTimeoutId = null;
    }
  }

  setAutoClose(delay: number): void {
    if (this.autoCloseTimeoutId) {
      clearTimeout(this.autoCloseTimeoutId);
    }
    this.autoCloseTimeoutId = window.setTimeout(() => {
      this.hide();
    }, delay);
  }
}
