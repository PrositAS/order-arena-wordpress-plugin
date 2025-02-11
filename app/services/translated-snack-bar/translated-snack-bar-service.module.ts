import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CmTranslateServiceModule } from '../cm-translate/cm-translate-service.module';
import { TranslatedSnackBarService } from './translated-snack-bar.service';

@NgModule({
  imports: [CmTranslateServiceModule, MatSnackBarModule],
  providers: [TranslatedSnackBarService],
})
export class TranslatedSnackBarServiceModule {}
