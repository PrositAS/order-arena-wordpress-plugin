/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { Pipe, PipeTransform } from '@angular/core';
import { OrderStatus } from 'src/@types/order-arena-user-portal/OrderStatus';
import { isNullOrUndefined } from 'src/app/@core/utils';

@Pipe({
  name: 'orderStatus',
})
export class OrderStatusPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (isNullOrUndefined(value)) {
      return null;
    }
    return typeof value === 'string' ? value.toUpperCase() : OrderStatus[value].toUpperCase();
  }
}
