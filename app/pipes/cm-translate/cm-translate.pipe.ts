/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { isNullOrUndefined } from '../../@core/utils';

@Pipe({
  name: 'appTranslate',
  pure: false,
})
export class CmTranslatePipe implements PipeTransform, OnDestroy {
  private sub: Subscription;

  private output: string;

  constructor(
    private translateService: TranslateService,
    private ref: ChangeDetectorRef
  ) {}

  transform(value: string, skipTranslate = false): string {
    if (skipTranslate) {
      return value;
    }

    this.output = value;
    if (isNullOrUndefined(value)) {
      return '';
    }

    this.sub = this.translateService.get(value).subscribe((v) => {
      this.output = v;
      if (this.output === value) {
        this.output = this.output.replace(/_/g, ' ').toLowerCase();
      }
      this.ref.markForCheck();
    });

    return this.output;
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
