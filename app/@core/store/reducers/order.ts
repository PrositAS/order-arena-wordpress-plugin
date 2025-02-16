import { utc } from 'moment';
import {
  initDeliveryAddress,
  initInvoice,
  initOrderData,
} from 'src/@types/order-arena-user-portal/order-form/InitValues';
import { Order } from 'src/@types/order-arena-user-portal/order-form/Order';

const initOrder: Order = {
  user: null,
  isOrderArticlesValid: false,
  isPickup: false,
  pastOrderData: JSON.parse(JSON.stringify({ ...initOrderData })),
  invoice: JSON.parse(
    JSON.stringify({
      ...initInvoice,
    })
  ),
  deliveryAddress: JSON.parse(
    JSON.stringify({
      ...initDeliveryAddress,
    })
  ),
  deliveryTime: {
    date: null,
    deliveryStart: null,
    deliveryEnd: null,
    eatingTime: null,
  },
  additionalInfo: {
    doDeliveryInfo: false,
    deliveryInfo: null,
    guests: null,
    notes: null,
  },
  termsAndConditions: false,
};

export const order = (state: Order = { ...initOrder }, { type, payload }): Order => {
  switch (type) {
    case 'SET_ORDER':
      return payload;

    case 'UPDATE_ORDER':
      return getNewState(state, payload as Partial<Order>);

    case 'CLEAR_USER':
    case 'RESET_ORDER':
    case 'COMPLETE_ORDER':
      return initOrder;

    case 'UPDATE_ORDER_USER':
      return getNewState(state, { user: payload } as Pick<Order, 'user'>);

    case 'UPDATE_ORDER_IS_PICKUP':
      return getNewState(state, { isPickup: payload } as Pick<Order, 'isPickup'>);

    case 'RESET_ORDER_IS_PICKUP':
      return getNewState(state, { isPickup: initOrder.isPickup } as Pick<Order, 'isPickup'>);

    case 'UPDATE_ORDER_PAST_DATA':
      return getNewState(state, { pastOrderData: { ...payload } } as Pick<Order, 'pastOrderData'>);

    case 'RESET_ORDER_PAST_DATA':
      return getNewState(state, { pastOrderData: initOrder.pastOrderData } as Pick<Order, 'pastOrderData'>);

    case 'UPDATE_ORDER_INVOICE':
      return getNewState(state, { invoice: { ...state.invoice, ...payload } } as Pick<Order, 'invoice'>);

    case 'RESET_ORDER_INVOICE':
      return getNewState(state, { invoice: { ...initOrder.invoice } } as Pick<Order, 'invoice'>);

    case 'UPDATE_ORDER_DELIVERY_ADDRESS':
      return getNewState(state, { deliveryAddress: { ...state.deliveryAddress, ...payload } } as Pick<
        Order,
        'deliveryAddress'
      >);

    case 'RESET_ORDER_DELIVERY_ADDRESS':
      return getNewState(state, { deliveryAddress: { ...initOrder.deliveryAddress } } as Pick<
        Order,
        'deliveryAddress'
      >);

    case 'UPDATE_ORDER_DELIVERY_TIME':
      return getNewState(state, { deliveryTime: { ...state.deliveryTime, ...payload } } as Pick<
        Order,
        'deliveryTime'
      >);

    case 'RESET_ORDER_DELIVERY_TIME':
      return getNewState(state, { deliveryTime: { ...initOrder.deliveryTime } } as Pick<
        Order,
        'deliveryTime'
      >);

    case 'UPDATE_ORDER_ADDITIONAL_INFO':
      return getNewState(state, { additionalInfo: { ...state.additionalInfo, ...payload } } as Pick<
        Order,
        'additionalInfo'
      >);

    case 'RESET_ORDER_ADDITIONAL_INFO':
      return getNewState(state, { additionalInfo: { ...initOrder.additionalInfo } } as Pick<
        Order,
        'additionalInfo'
      >);
  }

  return getNewState(
    state,
    state.deliveryTime
      ? ({ deliveryTime: { ...state.deliveryTime, date: utc(state.deliveryTime.date) } } as Pick<
          Order,
          'deliveryTime'
        >)
      : ({} as Partial<Order>)
  );
};

function getNewState(state: Order, updatedState: Partial<Order>): Order {
  return { ...(state || {}), ...updatedState } as Order;
}
