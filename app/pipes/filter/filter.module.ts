/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FilterPipe } from './filter.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [FilterPipe],
  exports: [FilterPipe],
})
export class FilterModule {}
