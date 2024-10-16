/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { NgModule } from '@angular/core';
import { TitleDirective } from './title.directive';

@NgModule({
  declarations: [TitleDirective],
  exports: [TitleDirective],
})
export class TitleModule {}
