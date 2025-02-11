/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArticleImageBackgroundDirective } from './article-image-background.directive';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ ArticleImageBackgroundDirective ],
  exports:      [
    ArticleImageBackgroundDirective,
  ],
})
export class ArticleImageBackgroundModule {}
