export const isPickup = (state = false, { type, payload }): boolean => {
  switch (type) {
    case 'UPDATE_IS_PICKUP':
      if (state !== payload) {
        return payload;
      }
      break;
    case 'RESET_ORDER':
      if (state) {
        return false;
      }
      break;
  }

  return state;
};
