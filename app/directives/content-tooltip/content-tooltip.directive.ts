/*
 * Copyright (c) 2020. MH Mariusz Henn
 */

import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appContentTooltip]',
})
export class ContentTooltipDirective implements OnInit, OnDestroy {
  @Input() appContentTooltip: string;
  parent: HTMLElement;
  element: HTMLElement;
  private tooltip: HTMLElement | null;

  text: string;
  maxSize: number;
  private mouseover: () => void;
  private mouseout: () => void;
  isOver: boolean;

  constructor(private el: ElementRef, private rnd: Renderer2) {}

  ngOnInit() {
    this.element = this.el.nativeElement;
    this.initTooltip();
  }

  ngOnDestroy() {
    if (this.mouseout) {
      this.mouseout();
    }
    this.RemoveTooltip();
    if (this.mouseover) {
      this.mouseover();
    }
  }

  private initTooltip() {
    this.mouseover = this.rnd.listen(this.element, 'mouseenter', () => {
      this.parent = this.element.parentNode as HTMLElement;
      this.maxSize = parseInt(getComputedStyle(this.element).getPropertyValue('font-size'), 10);
      this.text = this.appContentTooltip || this.element.innerText;
      this.isOver = true;
      if (this.appContentTooltip && this.appContentTooltip.length || this.isLarger) {
        this.CreateTooltip();
      }
    });
    this.mouseout = this.rnd.listen(this.element, 'mouseleave', () => {
      this.isOver = false;
      this.RemoveTooltip();
    });
  }

  private RemoveTooltip() {
    if (this.tooltip) {
      this.rnd.removeChild(this.el, this.tooltip);
      this.tooltip.remove();
    }
  }

  private CreateTooltip() {
    this.tooltip = this.rnd.createElement('div') as HTMLElement;
    this.tooltip.style.position = 'fixed';
    this.tooltip.style.top = '-1000px';
    this.rnd.addClass(this.tooltip, 'tooltip');
    this.rnd.addClass(this.tooltip, 'in');
    this.rnd.addClass(this.tooltip, 'top');
    const arr = this.rnd.createElement('div');
    const inner = this.rnd.createElement('div');
    inner.innerHTML = this.appContentTooltip || this.element.innerHTML;
    this.rnd.addClass(arr, 'tooltip-arrow');
    this.rnd.addClass(inner, 'tooltip-inner');
    this.rnd.appendChild(this.tooltip, inner);
    this.rnd.appendChild(this.tooltip, arr);
    this.rnd.appendChild(document.body, this.tooltip);
    this.CalculatePosition(this.tooltip);
  }

  private get isLarger(): boolean {
    const reference = this.referenceElementWidth();
    // cell width - padding
    return reference >= this.element.offsetWidth + 18;
  }

  private referenceElementWidth(): number {
    const el = this.rnd.createElement(this.element.tagName);
    this.rnd.appendChild(el, this.rnd.createText(this.text));
    this.rnd.setStyle(el, 'position', 'fixed');
    this.rnd.setStyle(el, 'top', '-1000px');
    this.rnd.appendChild(this.parent, el);
    this.rnd.setStyle(el, 'font-size', this.element.style.fontSize);
    const width = el.getBoundingClientRect().width;
    this.rnd.removeChild(this.parent, el);
    return width;
  }

  private CalculatePosition(tooltip: HTMLElement) {
    const rec = this.element.getBoundingClientRect();
    const tooltipRec = tooltip.getBoundingClientRect();
    tooltip.style.left = rec.left - tooltipRec.width / 2 + rec.width / 2 + 'px';
    tooltip.style.top = rec.top - tooltipRec.height + 'px';
  }
}
