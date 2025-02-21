import { Article } from './Article';
import { ID } from './ID';
import { OrderArticleChild } from './OrderArticleChild';
import { QuantityType } from './QuantityType';

export interface OrderArticle {
  id?: ID;
  article: Article;
  articlePrice: number;
  childArticles: OrderArticleChild[];
  position: number;
  quantity: number;
  quantityType: QuantityType;
  totalPrice: number;
  totalPriceMva: number;
  _basic?: OrderArticleChild[];
  _extra?: OrderArticleChild[];
}
