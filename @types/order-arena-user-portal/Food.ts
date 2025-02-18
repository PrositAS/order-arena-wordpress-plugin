import { Allergen } from './Allergen';
import { FoodRelation } from './FoodRelation';
import { ID } from './ID';
import { QuantityType } from './QuantityType';
import { Syncable } from './Syncable';

export interface Food extends Syncable {
  id?: ID;
  name: string;
  description?: string;
  active: boolean;
  allergens?: Allergen[];
  baseQuantity?: number;
  quantityPerPortion?: number;
  childFoodRelations?: FoodRelation[];
  childFoods?: Food[];
  parentFoodRelations?: FoodRelation[];
  parentFoods?: Food[];
  quantityType?: QuantityType;
  quantityTypeId?: ID;
  pricePerUnit?: number;
  hasArticle: boolean;
  isNew?: boolean;
  isChanged?: boolean;
  toRemove?: boolean;
  toAdd?: boolean;
  relationId?: ID;
}
