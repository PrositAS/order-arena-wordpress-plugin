export function updateIsPickupAction(isPickup: boolean) {
  return {
    type: 'UPDATE_IS_PICKUP',
    payload: isPickup,
  };
}
