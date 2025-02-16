/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { Pipe, PipeTransform } from '@angular/core';

type FilterFn = (element: any, elements: any) => boolean;

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(value: any, elements: any[], key: string | FilterFn = 'id'): any {
    if (Array.isArray(elements) && elements.length > 0 && Array.isArray(value)) {
      let compareFn: any;
      if (typeof key === 'function') {
        compareFn = key;
      } else {
        compareFn = (el, ids) => {
          return ids.indexOf(el[key]) === -1;
        };
      }

      return value.filter((el) => compareFn(el, elements));
    } else {
      return value;
    }
  }
}
