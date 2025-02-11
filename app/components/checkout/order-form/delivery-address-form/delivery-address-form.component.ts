import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddressForm } from 'src/@types/order-arena-user-portal/order-form/Address';
import { DeliveryAddressForm } from 'src/@types/order-arena-user-portal/order-form/DeliveryAddress';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { AddressFormComponent } from '../address-form/address-form.component';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,

    // Angular Material
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,

    // Prosit
    CmTranslateModule,

    AddressFormComponent,
  ],
  selector: 'app-delivery-address-form',
  templateUrl: './delivery-address-form.component.html',
  styleUrls: ['./delivery-address-form.component.scss'],
})
export class DeliveryAddressFormComponent {
  @Input({ required: true }) form!: FormGroup<DeliveryAddressForm>;

  get useInvoiceAddress(): boolean {
    return this.form.controls.useInvoiceAddress.value;
  }

  get address(): FormGroup<AddressForm> {
    return this.form.controls.address;
  }
}
