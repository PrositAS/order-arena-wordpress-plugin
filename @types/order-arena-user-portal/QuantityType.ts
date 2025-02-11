import { ID } from './ID';
import { Syncable } from './Syncable';

export interface QuantityType extends Syncable {
  id?: ID;
  name?: string;
}
