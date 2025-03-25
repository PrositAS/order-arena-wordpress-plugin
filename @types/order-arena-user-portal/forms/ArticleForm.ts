import { ArticleGroup } from '../ArticleGroup';
import { Food } from '../Food';
import { ID } from '../ID';
import { QuantityType } from '../QuantityType';

export interface ArticleForm {
  id?: ID;
  price: number;
  activeWeb: boolean;
  quantityPerPerson: number;
  baseQuantity: number;
  activePeriodStart: string;
  activePeriodEnd: string;
  minPersons: number;
  groups: ArticleGroup[];
  name: string;
  description: string;
  active: boolean;
  quantityType: QuantityType;
  articles: Food[];
  visibility: string;
}
