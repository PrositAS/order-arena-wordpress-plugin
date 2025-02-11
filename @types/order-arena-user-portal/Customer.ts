import { Company } from './Company';
import { CustomerAddress } from './CustomerAddress';
import { ID } from './ID';
import { Order } from './Order';
import { Syncable } from './Syncable';

export interface Customer extends Syncable {
  id?: ID;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  role?: string;
  customerAddresses?: CustomerAddress[];
  orders?: Order[];
  companies?: Company[];
}
