import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddressForm } from 'src/@types/order-arena-user-portal/order-form/Address';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { ValidationErrorModule } from 'src/app/pipes/validation-error/validation-error.module';
import { PostcodeInputComponent } from 'src/app/shared-components/inputs/postcode-input/postcode-input.component';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,

    // Angular Material
    MatFormFieldModule,
    MatInputModule,

    // Prosit
    CmTranslateModule,
    ValidationErrorModule,
    PostcodeInputComponent,
  ],
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
})
export class AddressFormComponent {
  @Input({ required: true }) form!: FormGroup<AddressForm>;

  get controls(): AddressForm {
    return this.form.controls;
  }

  get street(): FormControl<string> {
    return this.controls.street;
  }

  get apartment(): FormControl<string> {
    return this.controls.apartment;
  }

  get postal(): FormControl<string> {
    return this.controls.postal;
  }

  get city(): FormControl<string> {
    return this.controls.city;
  }
}
