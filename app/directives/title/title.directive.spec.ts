/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { ElementRef, Renderer2 } from '@angular/core';
import { TitleDirective } from './title.directive';

describe('TitleDirective', () => {
  it('should create an instance', () => {
    const directive = new TitleDirective(new ElementRef(document.createElement('div')), {} as Renderer2);
    expect(directive).toBeTruthy();
  });
});
