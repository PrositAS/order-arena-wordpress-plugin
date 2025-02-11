/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { NgModule } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CmTranslatePipe } from './cm-translate.pipe';

@NgModule({
  imports: [TranslateModule],
  declarations: [CmTranslatePipe],
  exports: [CmTranslatePipe],
  providers: [TranslateService],
})
export class CmTranslateModule {}
