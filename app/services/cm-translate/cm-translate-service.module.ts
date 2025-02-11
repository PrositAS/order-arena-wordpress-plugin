import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CmTranslateService } from './cm-translate.service';

@NgModule({
  imports: [TranslateModule],
  providers: [CmTranslateService],
})
export class CmTranslateServiceModule {}
