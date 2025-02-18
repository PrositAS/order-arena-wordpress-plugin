import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { ValidationErrorModule } from 'src/app/pipes/validation-error/validation-error.module';
import { OrderFormServiceModule } from 'src/app/services/order/order-form/order-form-service.module';
import { TranslatedSnackBarServiceModule } from 'src/app/services/translated-snack-bar/translated-snack-bar-service.module';
import { OrderConfirmationDialogComponent } from 'src/app/shadowed-components/order-confirmation-dialog/order-confirmation-dialog.component';
import { LoginButtonComponent } from '../../login/login-button/login-button.component';
import { LoginComponent } from '../../login/login/login.component';
import { UserLoginButtonComponent } from '../../login/user-login-button/user-login-button.component';
import { AdditionalInfoFormComponent } from './additional-info-form/additional-info-form.component';
import { DeliveryAddressFormComponent } from './delivery-address-form/delivery-address-form.component';
import { DeliveryTimeFormComponent } from './delivery-time-form/delivery-time-form.component';
import { InvoiceFormModule } from './invoice-form/invoice-form.module';
import { OrderFormHeaderComponent } from './order-form-header/order-form-header.component';
import { OrderFormComponent } from './order-form/order-form.component';
import { PastOrderDeliveryDataFormComponent } from './past-order-delivery-data-form/past-order-delivery-data-form.component';
import { TermsAndConditionsFormComponent } from './terms-and-conditions-form/terms-and-conditions-form.component';

@NgModule({
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', hideRequiredMarker: true },
    },
  ],
  imports: [
    // Angular
    CommonModule,
    CmTranslateModule,

    // Angular Material
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,

    // Prosit
    OrderFormServiceModule,
    ValidationErrorModule,
    TranslatedSnackBarServiceModule,

    UserLoginButtonComponent,
    PastOrderDeliveryDataFormComponent,
    InvoiceFormModule,
    DeliveryAddressFormComponent,
    DeliveryTimeFormComponent,
    AdditionalInfoFormComponent,
    TermsAndConditionsFormComponent,
    LoginButtonComponent,
    LoginComponent,
    OrderConfirmationDialogComponent,
  ],
  declarations: [OrderFormComponent, OrderFormHeaderComponent],
  exports: [OrderFormComponent],
})
export class OrderFormModule {}
