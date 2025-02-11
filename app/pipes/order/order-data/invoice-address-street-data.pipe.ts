import { Pipe, PipeTransform } from '@angular/core';
import { Invoice } from 'src/@types/order-arena-user-portal/order-form/Invoice';
import { Order, OrderData } from 'src/@types/order-arena-user-portal/order-form/Order';
import { displayAddressData } from './display-part';

@Pipe({
  name: 'invoiceAddressStreetData',
})
export class InvoiceAddressStreetDataPipe implements PipeTransform {
  transform(order: OrderData | Order): string {
    if (order) {
      const invoice: Invoice = order.invoice || null;

      if (invoice) {
        if (!invoice.forCompany && invoice.personalInvoice) {
          return displayAddressData(invoice.personalInvoice.address, ['street', 'apartment']);
        } else if (invoice.forCompany && invoice.companyInvoice) {
          return displayAddressData(invoice.companyInvoice.address, ['street', 'apartment']);
        }
      }
    }

    return '';
  }
}
