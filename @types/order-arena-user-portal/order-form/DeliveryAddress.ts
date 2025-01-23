import { FormControl, FormGroup } from '@angular/forms';
import { Address, AddressForm } from './Address';

export interface DeliveryAddress {
  useInvoiceAddress: boolean;
  address: Address;
}

export interface DeliveryAddressForm {
  useInvoiceAddress: FormControl<boolean>;
  address: FormGroup<AddressForm>;
}
