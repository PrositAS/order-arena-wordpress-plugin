import { ID } from './ID';
import { QuantityType } from './QuantityType';
import { Syncable } from './Syncable';

export interface Venue extends Syncable {
  id?: ID;
  active: boolean;
  description: string;
  name: string;
  quantityType: QuantityType;
}
