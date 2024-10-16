/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { NaturalNumberDirective } from './natural-number.directive';

describe('NaturalNumberDirective', () => {
  it('should create an instance', () => {
    const element = { nativeElement: document.createElement('input') };
    const directive = new NaturalNumberDirective(element);
    expect(directive).toBeTruthy();
  });
});
