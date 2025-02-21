import { FormControl, FormGroup } from '@angular/forms';
import { Address, AddressForm } from './Address';

export interface PersonalInvoice {
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: Address;
}

export interface PersonalInvoiceForm {
  name: FormControl<string>;
  surname: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  address: FormGroup<AddressForm>;
}
