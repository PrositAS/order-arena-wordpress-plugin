import { ID } from './ID';
import { OrderStatusEnum } from './OrderStatus';
import { Syncable } from './Syncable';

export interface OrderFlow extends Syncable {
  id?: ID;
  name: string;
  position: number;
  required?: boolean;
  status?: OrderStatusEnum;
}
