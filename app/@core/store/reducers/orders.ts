import { Order } from 'src/@types/order-arena-user-portal/Order';

export const orders = (state: Order[] = null, { type, payload }): Order[] => {
  switch (type) {
    case 'SET_ORDERS':
      return [...payload];
    case 'CLEAR_USER':
    case 'RESET_ORDERS':
      return null;
  }

  return state;
};
