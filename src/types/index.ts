export interface IProduct {
  id: string;
  description?: string;
  image?: string;
  title: string;
  category?: string;
  price: number | null;
}

export interface IOrder {
  payment?: string;
  address?: string;
  email?: string;
  phone?: string;
}

export interface IFullOrder extends IOrder {
  items?: string[];
  total?: number | string;
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