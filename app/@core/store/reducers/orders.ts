import { Order } from 'src/@types/order-arena-user-portal/Order';

export const orders = (state: Order[] = null, { type, payload }): Order[] => {
  switch (type) {
    case 'SET_ORDERS':
      return [...payload];
    case 'UPDATE_ORDERS':
      return getNewState(state, payload);
    case 'CLEAR_USER':
    case 'RESET_ORDERS':
      return null;
  }

  return state;
};

function getNewState(state: Order[], updatedState: Order[] = []): Order[] {
  if (!state) {
    return updatedState;
  }

  const additionalState = updatedState.filter((order) => !state.find((o) => o.id === order.id));

  return [...state, ...(additionalState || [])];
}
