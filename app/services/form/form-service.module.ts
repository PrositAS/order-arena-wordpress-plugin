import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormService } from './form.service';

@NgModule({
  imports: [FormsModule, ReactiveFormsModule],
  providers: [FormService],
})
export class FormServiceModule {}
