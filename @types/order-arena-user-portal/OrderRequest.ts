import { Address } from './Address';
import { Customer } from './Customer';
import { ID } from './ID';
import { OrderEquipment, OrderNote, OrderPeople, OrderPrice, OrderSchedule } from './Order';
import { OrderArticle } from './OrderArticle';
import { OrderInvoice } from './OrderInvoice';
import { OrderStatus } from './OrderStatus';

export interface OrderRequest {
  customer: Customer;
  id: ID;
  invoice: OrderInvoice;
  orderAddress: Address;
  orderArticles: [OrderArticle];
  orderEquipment: OrderEquipment;
  orderNote: OrderNote;
  orderPeople: OrderPeople;
  orderPrice: OrderPrice;
  orderSchedule: OrderSchedule;
  source: string;
  status: OrderStatus;
}
