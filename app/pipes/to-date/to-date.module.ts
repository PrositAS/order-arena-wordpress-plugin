/*
 * Copyright (c) 2020. Prosit A.S.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToDatePipe } from './to-date.pipe';

@NgModule({
  declarations: [ToDatePipe],
  exports: [ToDatePipe],
  imports: [CommonModule],
})
export class ToDateModule {}
