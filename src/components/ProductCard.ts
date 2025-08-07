export interface IProduct {
  id: string;
  description?: string;
  image?: string;
  title: string;
  category?: string;
  price: number | null;
}

export interface IOrderForm {
  payment?: string;
  address?: string;
  email?: string;
  phone?: string;
  total?: number | string;
}

export interface IOrder extends IOrderForm {
  items: string[];
}

export interface IAppState {
  basketList: IProduct[];
  preview: string | null;
  loading: boolean;
}

export interface IApi {
  baseUrl: string;
  requestOptions: string;
}

export type FormErrors = {
  [key in keyof IOrder]?: string;
};

export class ProductCard {
  private _title: HTMLElement;
  private _price: HTMLElement;
  private _category: HTMLElement;
  private _image?: HTMLImageElement;
  private _button?: HTMLButtonElement;
  private _index?: HTMLSpanElement;

  constructor(
    title: HTMLElement,
    price: HTMLElement,
    category: HTMLElement,
    image?: HTMLImageElement,
    button?: HTMLButtonElement,
    index?: HTMLSpanElement
  ) {
    this._title = title;
    this._price = price;
    this._category = category;
    this._image = image;
    this._button = button;
    this._index = index;
  }

  set id(value: string) {
    if (this._index) {
      this._index.textContent = value;
    }
  }

  get id(): string | undefined {
    return this._index?.textContent ?? undefined;
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  get title(): string {
    return this._title.textContent ?? '';
  }

  get price(): string {
    return this._price.textContent ?? '';
  }

  set category(value: string) {
    this._category.style.color = value;
  }

  set image(value: string) {
    if (this._image) {
      this._image.src = value;
    }
  }

  set button(value: string) {
    if (this._button) {
      this._button.textContent = value;
    }
  }
}
