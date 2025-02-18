import { Pipe, PipeTransform } from '@angular/core';
import { Order, OrderData } from 'src/@types/order-arena-user-portal/order-form/Order';
import { displayCustomerData } from './display-part';

@Pipe({
  name: 'orderCustomerData',
})
export class OrderCustomerDataPipe implements PipeTransform {
  transform(order: OrderData | Order): string {
    if (order) {
      return order.invoice
        ? order.invoice.forCompany
          ? displayCustomerData(order.invoice.companyInvoice, ['company'])
          : displayCustomerData(order.invoice.personalInvoice, ['name', 'surname'])
        : '';
    }

    return '';
  }
}
