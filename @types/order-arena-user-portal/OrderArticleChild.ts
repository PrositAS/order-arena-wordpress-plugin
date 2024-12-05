import { Article } from './Article';
import { ID } from './ID';
import { QuantityType } from './QuantityType';

export interface OrderArticleChild {
  id: ID;
  article: Article;
  quantity: number;
  quantityType: QuantityType;
  extraArticle: boolean;
}
