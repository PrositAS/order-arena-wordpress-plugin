/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { NgModule } from '@angular/core';
import { PhoneNumberDirective } from './phone-number.directive';

@NgModule({
  declarations: [PhoneNumberDirective],
  exports: [PhoneNumberDirective],
})
export class PhoneNumberDirectiveModule {}
