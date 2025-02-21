/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appPhoneNumber]',
})
export class PhoneNumberDirective {
  allowedChars = [
    '+',
    '-',
    '(',
    ')',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0',
    ' ',
    'Backspace',
    'Delete',
  ];

  constructor(elRef: ElementRef) {
    elRef.nativeElement.addEventListener('keydown', (e: KeyboardEvent) => {
      if (!this.allowedChars.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  }
}
