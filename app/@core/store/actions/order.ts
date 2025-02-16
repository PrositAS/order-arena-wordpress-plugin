import gql from 'graphql-tag';
import { AdditionalInfo } from 'src/@types/order-arena-user-portal/order-form/AdditionalInfo';
import { DeliveryAddress } from 'src/@types/order-arena-user-portal/order-form/DeliveryAddress';
import { DeliveryTime } from 'src/@types/order-arena-user-portal/order-form/DeliveryTime';
import { Invoice } from 'src/@types/order-arena-user-portal/order-form/Invoice';
import { Order, OrderData } from 'src/@types/order-arena-user-portal/order-form/Order';
import { User } from 'src/@types/order-arena-user-portal/User';
import { OnOrderRequest } from '../fragments/OnOrderRequest';

export function setOrderAction(order: Order) {
  return {
    type: 'SET_ORDER',
    payload: order,
  };
}

export function updateOrderAction(order: Partial<Order>) {
  return {
    type: 'UPDATE_ORDER',
    payload: order,
  };
}

export function resetOrderAction() {
  return {
    type: 'RESET_ORDER',
  };
}

export function completeOrderAction() {
  return {
    type: 'COMPLETE_ORDER',
  };
}

export function updateOrderUserAction(user: User) {
  return {
    type: 'UPDATE_ORDER_USER',
    payload: user,
  };
}

export function updateOrderIsPickupAction(isPickup: boolean) {
  return {
    type: 'UPDATE_ORDER_IS_PICKUP',
    payload: isPickup,
  };
}

export function resetOrderIsPickupAction() {
  return {
    type: 'RESET_ORDER_IS_PICKUP',
  };
}

export function updateOrderPastOrderDataAction(pastOrderData: OrderData) {
  return {
    type: 'UPDATE_ORDER_PAST_DATA',
    payload: pastOrderData,
  };
}

export function resetOrderPastOrderDataAction() {
  return {
    type: 'RESET_ORDER_PAST_DATA',
  };
}

export function updateOrderInvoiceAction(invoice: Partial<Invoice>) {
  return {
    type: 'UPDATE_ORDER_INVOICE',
    payload: invoice,
  };
}

export function resetOrderInvoiceAction() {
  return {
    type: 'RESET_ORDER_INVOICE',
  };
}

export function updateOrderDeliveryAddressAction(deliveryAddress: Partial<DeliveryAddress>) {
  return {
    type: 'UPDATE_ORDER_DELIVERY_ADDRESS',
    payload: deliveryAddress,
  };
}

export function resetOrderDeliveryAddressAction() {
  return {
    type: 'RESET_ORDER_DELIVERY_ADDRESS',
  };
}

export function updateOrderDeliveryTimeAction(deliveryTime: Partial<DeliveryTime>) {
  return {
    type: 'UPDATE_ORDER_DELIVERY_TIME',
    payload: deliveryTime,
  };
}

export function resetOrderDeliveryTimeAction() {
  return {
    type: 'RESET_ORDER_DELIVERY_TIME',
  };
}

export function updateOrderAdditionalInfoAction(additionalInfo: Partial<AdditionalInfo>) {
  const { guests, ...additionalInfoWithoutGuests } = additionalInfo;
  return {
    type: 'UPDATE_ORDER_ADDITIONAL_INFO',
    payload: additionalInfoWithoutGuests,
  };
}

export function resetOrderAdditionalInfoAction() {
  return {
    type: 'RESET_ORDER_ADDITIONAL_INFO',
  };
}

export const orderRequestMutation = gql`
  mutation createOrderByCustomer($order: JSON) {
    createOrderByCustomer(clientOrder: $order) {
      ...OrderRequestDetails
    }
  }
  ${OnOrderRequest.OrderRequestDetails}
`;
