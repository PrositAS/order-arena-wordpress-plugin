import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllergensPipe } from './allergens.pipe';

@NgModule({
  imports:      [
    CommonModule,
  ],
  exports:      [
    AllergensPipe,
  ],
  declarations: [ AllergensPipe ],
})
export class AllergensModule { }
