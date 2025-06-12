import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AddressForm } from 'src/@types/order-arena-user-portal/order-form/Address';
import { CompanyInvoiceForm } from 'src/@types/order-arena-user-portal/order-form/CompanyInvoice';

@Component({
  selector: 'app-company-invoice-form',
  templateUrl: './company-invoice-form.component.html',
  styleUrls: ['./company-invoice-form.component.scss'],
})
export class CompanyInvoiceFormComponent {
  @Input({ required: true }) form!: FormGroup<CompanyInvoiceForm>;

  get controls(): CompanyInvoiceForm {
    return this.form.controls;
  }

  get name(): FormControl<string> {
    return this.controls.name;
  }

  get surname(): FormControl<string> {
    return this.controls.surname;
  }

  get email(): FormControl<string> {
    return this.controls.email;
  }

  get phone(): FormControl<string> {
    return this.controls.phone;
  }

  get address(): FormGroup<AddressForm> {
    return this.controls.address;
  }

  get company(): FormControl<string> {
    return this.controls.company;
  }

  get companyNumber(): FormControl<string> {
    return this.controls.companyNumber;
  }
}
