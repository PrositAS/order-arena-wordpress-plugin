import { CompanyInvoice } from './order-form/CompanyInvoice';
import { PersonalInvoice } from './order-form/PersonalInvoice';

export type PersonalData = Pick<PersonalInvoice | CompanyInvoice, 'name' | 'surname' | 'email' | 'phone'>;
