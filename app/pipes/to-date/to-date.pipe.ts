/*
 * Copyright (c) 2020. Prosit A.S.
 */

import { Pipe, PipeTransform } from '@angular/core';
import { utc } from 'moment';

@Pipe({
  name: 'toDate',
})
export class ToDatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return utc(value);
  }
}
