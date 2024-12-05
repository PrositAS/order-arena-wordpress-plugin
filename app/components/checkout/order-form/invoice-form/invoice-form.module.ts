import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { ValidationErrorModule } from 'src/app/pipes/validation-error/validation-error.module';
import { CompanyNumberInputComponent } from 'src/app/shared-components/inputs/company-number-input/company-number-input.component';
import { PhoneInputComponent } from 'src/app/shared-components/inputs/phone-input/phone-input.component';
import { AddressFormComponent } from '../address-form/address-form.component';
import { CompanyInvoiceFormComponent } from './company-invoice-form/company-invoice-form.component';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { PersonalInvoiceFormComponent } from './personal-invoice-form/personal-invoice-form.component';

@NgModule({
  providers: [],
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,

    // Angular Material
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,

    // Prosit
    CmTranslateModule,
    ValidationErrorModule,

    PhoneInputComponent,
    AddressFormComponent,
    CompanyNumberInputComponent,
  ],
  declarations: [InvoiceFormComponent, PersonalInvoiceFormComponent, CompanyInvoiceFormComponent],
  exports: [InvoiceFormComponent],
})
export class InvoiceFormModule {}
