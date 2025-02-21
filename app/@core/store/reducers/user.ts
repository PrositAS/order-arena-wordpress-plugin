import { User } from 'src/@types/order-arena-user-portal/User';

export function user(state: User = null, { type, payload }): User {
  switch (type) {
    case 'SET_USER':
      return { ...payload };

    case 'CLEAR_USER':
      return null;
  }
  return state;
}
