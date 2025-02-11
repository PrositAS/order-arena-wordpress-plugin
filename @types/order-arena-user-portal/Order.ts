import { Customer } from './Customer';
import { CustomerAddress } from './CustomerAddress';
import { ID } from './ID';
import { OrderArticle } from './OrderArticle';
import { OrderFlow } from './OrderFlow';
import { OrderInvoice } from './OrderInvoice';
import { OrderLogAction } from './OrderLogAction';
import { Syncable } from './Syncable';

export type OrderPickupAction = 'no_action' | 'delivered_by_customer' | 'to_be_pick_up';
export type OrderDeliveryAction = 'no_action' | 'pick_up_by_customer' | 'to_be_delivered';

export interface Order extends Syncable {
  _open?: boolean;
  id?: ID;
  status: string;
  customer?: Customer;
  invoice?: OrderInvoice;
  orderAddress: CustomerAddress;
  orderPeople: OrderPeople;
  orderSchedule: OrderSchedule;
  orderNote: OrderNote;
  orderPrice?: OrderPrice;
  orderEquipment: OrderEquipment;
  orderArticles: OrderArticle[];
  actionsCompleted: OrderLogAction[];
  actionsNext: OrderFlow[];
  _venues?: OrderArticle[];
  _equipments?: OrderArticle[];
  _foods?: OrderArticle[];
}

export interface OrderPeople {
  chefs?: number;
  waiters?: number;
  numberOfPersons: number;
}

export interface OrderSchedule {
  kitchenReadyAt?: string;
  deliverMinutesBefore?: number;
  drivingMinutesTime?: number;
  deliveryStart: string;
  deliveryEnd: string;
  serveAt: string;
  pickup: boolean;
}

export interface OrderNote {
  delivery: string;
  external: string;
  internal: string;
  orderNote: string;
}

export interface OrderPrice {
  totalPrice: number;
  finalPrice: number;
  discount?: number;
  mvaRate: number;
  finalPriceMva: number;
}

export interface OrderEquipment {
  deliveryAction: OrderDeliveryAction;
  deliveryDate?: string;
  daysBefore?: number;
  deliveryEnd?: string;
  deliveryStart?: string;
  deliveryAddress?: CustomerAddress;
  pickupAction: OrderPickupAction;
  pickupAddress?: CustomerAddress;
  pickupDaysAfter?: number;
  pickupEnd?: string;
  pickupStart?: string;
  pickupDate?: string;
}
