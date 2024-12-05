/*
 * Copyright (c) 2020. MH Mariusz Henn
 */

import { ElementRef, Renderer2 } from '@angular/core';
import { async, TestBed, waitForAsync } from '@angular/core/testing';
import { ContentTooltipDirective } from './content-tooltip.directive';

describe('ContentTooltipDirective', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [Renderer2],
    }).compileComponents();
  }));
  it('should create an instance', () => {
    const directive = new ContentTooltipDirective(
      new ElementRef(document.createElement('div')),
      TestBed.get(Renderer2)
    );
    expect(directive).toBeTruthy();
  });
});
