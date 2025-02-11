import { ID } from '../ID';

export interface AddressForm {
  id: ID;
  address: string;
  postal: string;
  city: string;
  addressType: string;
}
