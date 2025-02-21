import { ID } from './ID';

export interface OrderLogAction {
  changedAt: string;
  createdAt?: string;
  details?: string;
  name: string;
  orderId: ID;
  updatedAt?: string;
}
