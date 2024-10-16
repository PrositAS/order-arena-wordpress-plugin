/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { Renderer2 } from '@angular/core';
import { inject } from '@angular/core/testing';
import { ArticleImageBackgroundDirective } from './article-image-background.directive';

describe('ArticleImageBackgroundDirective', () => {
  it('should create an instance', () => {
    inject([ Renderer2 ], (renderer: Renderer2) => {
      const element = renderer.createElement('div');
      const directive = new ArticleImageBackgroundDirective(renderer, element);
      expect(directive).toBeTruthy();
    });
  });
});
