/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { PhoneNumberDirective } from './phone-number.directive';

describe('PhoneNumberDirective', () => {
  it('should create an instance', () => {
    const element = { nativeElement: document.createElement('input') };
    const directive = new PhoneNumberDirective(element);
    expect(directive).toBeTruthy();
  });
});
