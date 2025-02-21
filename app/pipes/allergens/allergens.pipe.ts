import { Pipe, PipeTransform } from '@angular/core';
import { Allergen } from 'src/@types/order-arena-user-portal/Allergen';

@Pipe({
  name: 'allergens',
})
export class AllergensPipe implements PipeTransform {
  transform(value: Allergen[], args?: any): any {
    return `${value.map((a) => a.name).join()}`;
  }
}
