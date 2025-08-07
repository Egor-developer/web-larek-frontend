export class PageLayout {
  private _counter: HTMLElement;
  private _catalog: HTMLElement;
  private _wrapper: HTMLElement;
  private _basketButton: HTMLElement;

  set counter(element: HTMLElement) {
    this._counter = element;
  }

  set catalog(element: HTMLElement) {
    this._catalog = element;
  }

  set locked(value: boolean) {
    if (value) {
      this._wrapper.classList.add('locked');
    } else {
      this._wrapper.classList.remove('locked');
    }
  }
}
