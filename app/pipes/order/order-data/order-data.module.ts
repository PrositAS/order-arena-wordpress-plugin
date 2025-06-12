import { NgModule } from '@angular/core';
import { DeliveryAddressPostalCityDataPipe } from './delivery-address-postal-city-data.pipe';
import { DeliveryAddressStreetDataPipe } from './delivery-address-street-data.pipe';
import { OrderCustomerDataPipe } from './order-customer-data.pipe';
import { InvoiceAddressStreetDataPipe } from './invoice-address-street-data.pipe';
import { InvoiceAddressPostalCityDataPipe } from './invoice-address-postal-city-data.pipe';

@NgModule({
  declarations: [
    OrderCustomerDataPipe,
    InvoiceAddressStreetDataPipe,
    InvoiceAddressPostalCityDataPipe,
    DeliveryAddressStreetDataPipe,
    DeliveryAddressPostalCityDataPipe,
  ],
  exports: [
    OrderCustomerDataPipe,
    InvoiceAddressStreetDataPipe,
    InvoiceAddressPostalCityDataPipe,
    DeliveryAddressStreetDataPipe,
    DeliveryAddressPostalCityDataPipe,
  ],
})
export class OrderDataModule {}
