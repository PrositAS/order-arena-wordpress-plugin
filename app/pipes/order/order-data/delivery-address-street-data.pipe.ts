import { Pipe, PipeTransform } from '@angular/core';
import { Address } from 'src/@types/order-arena-user-portal/order-form/Address';
import { DeliveryAddress } from 'src/@types/order-arena-user-portal/order-form/DeliveryAddress';
import { Order, OrderData } from 'src/@types/order-arena-user-portal/order-form/Order';
import { displayAddressData } from './display-part';

@Pipe({
  name: 'deliveryAddressStreetData',
})
export class DeliveryAddressStreetDataPipe implements PipeTransform {
  transform(order: OrderData | Order): string {
    if (order) {
      const deliveryAddress: DeliveryAddress = order.deliveryAddress || null;

      if (deliveryAddress) {
        if (!deliveryAddress.useInvoiceAddress && deliveryAddress.address) {
          return displayAddressData(deliveryAddress.address, ['street', 'apartment']);
        } else if (deliveryAddress.useInvoiceAddress && order.invoice) {
          const address: Address =
            !order.invoice.forCompany && order.invoice.personalInvoice
              ? order.invoice.personalInvoice.address
              : order.invoice.forCompany && order.invoice.companyInvoice
              ? order.invoice.companyInvoice.address
              : null;
          return displayAddressData(address, ['street', 'apartment']);
        }
      }
    }

    return '';
  }
}
