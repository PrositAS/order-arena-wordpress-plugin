import { FormControl } from '@angular/forms';
import { ID } from '../ID';

export interface Address {
  id?: ID;
  street: string;
  apartment: string;
  postal: string;
  city: string;
}

export interface AddressForm {
  id: FormControl<ID>;
  street: FormControl<string>;
  apartment: FormControl<string>;
  postal: FormControl<string>;
  city: FormControl<string>;
}
