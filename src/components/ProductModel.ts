export class ProductModel {
  private subscribers: (() => void)[] = [];

  // Подписка на изменения
  subscribe(callback: () => void): void {
    this.subscribers.push(callback);
  }

  // Метод emitChanges сообщает подписчикам об изменениях
  emitChanges(): void {
    this.subscribers.forEach((callback) => callback());
  }
}
