import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AddressForm } from 'src/@types/order-arena-user-portal/order-form/Address';
import { PersonalInvoiceForm } from 'src/@types/order-arena-user-portal/order-form/PersonalInvoice';

@Component({
  selector: 'app-personal-invoice-form',
  templateUrl: './personal-invoice-form.component.html',
  styleUrls: ['./personal-invoice-form.component.scss'],
})
export class PersonalInvoiceFormComponent {
  @Input({ required: true }) form!: FormGroup<PersonalInvoiceForm>;

  get controls(): PersonalInvoiceForm {
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
}
