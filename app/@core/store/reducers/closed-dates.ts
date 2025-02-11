import { ClosedDate } from 'src/@types/order-arena-user-portal/ClosedDate';

export const closedDates = (state: ClosedDate[] = null, { type, payload }): ClosedDate[] => {
  switch (type) {
    case 'SET_CLOSED_DATES':
      return [...payload];
    case 'RESET_CLOSED_DATES':
      return [];
  }

  return state;
};
