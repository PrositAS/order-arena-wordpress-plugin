import { ChangeDetectionStrategy, Component, ElementRef, Renderer2, ViewEncapsulation } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';

@Component({
  standalone: true,
  selector: '[pMatButtonToggleGroupSeparated]',
  styleUrls: ['mat-button-toggle-group-separated.directive.scss'],
  // exportAs: 'pMatButtonToggleGroupSeparated',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatButtonToggleGroupSeparatedDirective {
  constructor(elementRef: ElementRef<MatButtonToggleGroup>, renderer: Renderer2) {
    renderer.addClass(elementRef.nativeElement, 'p-mat-button-toggle-group-separated');
  }
}

// TODO: Handle adding CSS through directive
