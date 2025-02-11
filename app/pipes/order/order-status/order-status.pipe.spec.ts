/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { OrderStatus } from 'src/@types/order-arena-user-portal/OrderStatus';
import { OrderStatusPipe } from './order-status.pipe';

describe('OrderStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new OrderStatusPipe();
    expect(pipe).toBeTruthy();
  });

  it('should always return name', () => {
    const pipe = new OrderStatusPipe();
    expect(pipe.transform(OrderStatus.confirmed)).toEqual('CONFIRMED');
    expect(pipe.transform('confirmed')).toEqual('CONFIRMED');
    expect(pipe.transform(1)).toEqual('CONFIRMED');
  });
});
