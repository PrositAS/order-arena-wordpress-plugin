/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNaturalNumber]',
})
export class NaturalNumberDirective {
  constructor(elRef: ElementRef) {
    elRef.nativeElement.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'e' || e.key === '+' || e.key === '-' || e.key === ',' || e.key === '.') {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  }
}
