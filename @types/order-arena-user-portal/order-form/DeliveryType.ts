export const DeliveryType = ['delivery', 'pickup'] as const;
export type DeliveryType = (typeof DeliveryType)[number];
