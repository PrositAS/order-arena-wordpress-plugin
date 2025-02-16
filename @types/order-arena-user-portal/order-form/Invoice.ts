import { FormControl, FormGroup } from '@angular/forms';
import { CompanyInvoice, CompanyInvoiceForm } from './CompanyInvoice';
import { PersonalInvoice, PersonalInvoiceForm } from './PersonalInvoice';

export interface Invoice {
  forCompany: boolean;
  personalInvoice: PersonalInvoice;
  companyInvoice: CompanyInvoice;
}

export interface InvoiceForm {
  forCompany: FormControl<boolean>;
  personalInvoice: FormGroup<PersonalInvoiceForm>;
  companyInvoice: FormGroup<CompanyInvoiceForm>;
}
