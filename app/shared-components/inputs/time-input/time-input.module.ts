import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { TimeInputComponent } from './time-input/time-input.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,

    // Angular Material
    MatFormFieldModule,

    // Prosit
    CmTranslateModule,
  ],
  declarations: [TimeInputComponent],
  exports: [TimeInputComponent],
})
export class TimeInputModule {}
