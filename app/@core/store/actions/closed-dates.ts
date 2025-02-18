import gql from 'graphql-tag';
import { ClosedDate } from 'src/@types/order-arena-user-portal/ClosedDate';

export function setClosedDatesAction(closedDates: ClosedDate[]) {
  return {
    type: 'SET_CLOSED_DATES',
    payload: closedDates,
  };
}

export function resetClosedDatesAction() {
  return {
    type: 'RESET_CLOSED_DATES',
  };
}

export const closedDatesQuery = gql`
  query closedDates($filter: SaasClosedDateFilter) {
    closedDates(filter: $filter) {
      id
      closedFrom
      closedTo
      message
    }
  }
`;
