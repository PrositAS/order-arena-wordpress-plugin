import { FormControl, FormGroup } from '@angular/forms';
import { Address, AddressForm } from './Address';

export interface CompanyInvoice {
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: Address;
  company: string;
  companyNumber: string;
}

export interface CompanyInvoiceForm {
  name: FormControl<string>;
  surname: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  address: FormGroup<AddressForm>;
  company: FormControl<string>;
  companyNumber: FormControl<string>;
}
