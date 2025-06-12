import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CmTranslateServiceModule } from 'src/app/services/cm-translate/cm-translate-service.module';
import { ValidationErrorPipe } from './validation-error.pipe';

@NgModule({
  imports: [ReactiveFormsModule, CmTranslateServiceModule],
  providers: [TranslateService],
  declarations: [ValidationErrorPipe],
  exports: [ValidationErrorPipe],
})
export class ValidationErrorModule {}
