export enum OrderStatus {
  received,
  confirmed,
  orderChanged,
  froze,
  cooking,
  prepared,
  delivered,
  closed,
  equipmentDelivery,
  foodDelivery,
  equipmentReturn,
}

export type OrderStatusEnum = OrderStatus;
