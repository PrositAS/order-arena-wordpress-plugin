import { OrderForm, PostChildArticle, PostOrderArticle } from '../params/PostOrder';

export interface MappedOrder extends OrderForm {
  _venues?: MappedPostOrderArticle[];
  _foods?: MappedPostOrderArticle[];
  _equipments?: MappedPostOrderArticle[];
  articles: MappedPostOrderArticle[];
  orderPrice?: {
    totalPrice: number;
    vatRate: number;
  };
}

export interface MappedPostOrderArticle extends PostOrderArticle {
  _basic?: string;
  _extra?: PostChildArticle[];
}
