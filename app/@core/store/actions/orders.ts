import gql from 'graphql-tag';
import { Order } from 'src/@types/order-arena-user-portal/Order';
import { OnOrder } from '../fragments/OnOrder';
import { OnOrderRequest } from '../fragments/OnOrderRequest';

export function setOrdersAction(orders: Order[]) {
  return {
    type: 'SET_ORDERS',
    payload: orders,
  };
}

export function resetOrdersAction() {
  return {
    type: 'RESET_ORDERS',
  };
}

export const ordersQuery = gql`
  {
    orders {
      collection {
        ...OrderDetails
      }
    }
  }
  ${OnOrder.OrderDetails}
`;

export const orderRequestsQuery = gql`
  {
    orderRequests {
      ...OrderRequestListElement
    }
  }
  ${OnOrderRequest.OrderRequestListElement}
`;
