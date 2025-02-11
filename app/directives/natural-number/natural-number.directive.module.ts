/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { NgModule } from '@angular/core';
import { NaturalNumberDirective } from './natural-number.directive';

@NgModule({
  declarations: [NaturalNumberDirective],
  exports: [NaturalNumberDirective],
})
export class NaturalNumberDirectiveModule {}
