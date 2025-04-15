import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AdditionalInfoForm } from 'src/@types/order-arena-user-portal/order-form/AdditionalInfo';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { ValidationErrorModule } from 'src/app/pipes/validation-error/validation-error.module';

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
    ValidationErrorModule,
  ],
  selector: 'app-additional-info-form',
  templateUrl: './additional-info-form.component.html',
  styleUrls: ['./additional-info-form.component.scss'],
})
export class AdditionalInfoFormComponent {
  @Input({ required: true }) form!: FormGroup<AdditionalInfoForm>;
  @Input() minGuests = 1;

  get controls(): AdditionalInfoForm {
    return this.form.controls;
  }

  get doDeliveryInfo(): boolean {
    return this.controls.doDeliveryInfo.value;
  }

  get deliveryInfo(): FormControl<string> {
    return this.controls.deliveryInfo;
  }

  get guests(): FormControl<number> {
    return this.controls.guests;
  }
}
