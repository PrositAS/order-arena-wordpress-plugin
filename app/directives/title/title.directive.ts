/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { AfterContentChecked, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTitle]',
})
export class TitleDirective implements AfterContentChecked {
  @Input() cmTitle;

  constructor(private ref: ElementRef, private renderer: Renderer2) {}

  ngAfterContentChecked() {
    this.renderer?.setAttribute(this.ref.nativeElement, 'title', this.ref.nativeElement.innerText);
  }
}
