import { Food } from './Food';

export interface FoodRelation {
  childFood: Food;
  id: number;
  parentFood: Food;
  position: number;
  quantityPerPortion: number;
}
