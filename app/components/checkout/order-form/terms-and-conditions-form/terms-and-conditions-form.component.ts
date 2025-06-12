import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { ValidationErrorModule } from 'src/app/pipes/validation-error/validation-error.module';
import { pluginPagesPaths } from 'src/environments/plugin-config';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,

    // Angular Material
    MatFormFieldModule,
    MatCheckboxModule,

    // Prosit
    CmTranslateModule,
    ValidationErrorModule,
  ],
  selector: 'app-terms-and-conditions-form',
  templateUrl: './terms-and-conditions-form.component.html',
  styleUrls: ['./terms-and-conditions-form.component.scss'],
})
export class TermsAndConditionsFormComponent {
  @Input({ required: true }) control!: FormControl<boolean>;

  termsUrl: string = window.location.origin + pluginPagesPaths.terms;
}
