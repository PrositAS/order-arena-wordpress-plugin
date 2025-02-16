import { ID } from './ID';
import { QuantityType } from './QuantityType';
import { Syncable } from './Syncable';

export interface Equipment extends Syncable {
  id?: ID;
  active: boolean;
  description: string;
  name: string;
  quantityType: QuantityType;
}
