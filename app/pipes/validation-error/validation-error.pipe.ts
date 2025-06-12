import { ChangeDetectorRef, DestroyRef, inject, Pipe, PipeTransform } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { combineLatest, map, Observable, of, tap } from 'rxjs';
import { CmTranslateService } from 'src/app/services/cm-translate/cm-translate.service';

export interface Error {
  key: string;
  hint: string;
  hintData: string;
}

const errorHints: string[] = [
  'invalidCredentials',
  'inactiveCustomer',
  'differs',
  'min',
  'invalidDeliveryTimespan',
  'invalidEatingTime',
];

@Pipe({
  name: 'validationError',
  pure: false,
})
export class ValidationErrorPipe implements PipeTransform {
  errorMessage = '';

  error$: Observable<string>;
  hint$: Observable<string>;
  hintData$: Observable<string>;

  destroyRef = inject(DestroyRef);

  constructor(
    private cmTranslate: CmTranslateService,
    private ref: ChangeDetectorRef
  ) {}

  transform(control: AbstractControl): string {
    const errorCode: string = this.getErrorCode(control);

    if (errorCode) {
      const doDisplayHint: boolean = this.doDisplayHint(errorCode);

      this.error$ = this.cmTranslate.translate(errorCode, 'ERROR');
      this.hint$ = doDisplayHint ? this.cmTranslate.translate(errorCode, 'HINT') : of(null);
      this.hintData$ = doDisplayHint ? this.getHintData(control, errorCode) : of(null);

      combineLatest([this.error$, this.hint$, this.hintData$])
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap(([error, hint, hintData]) => {
            this.errorMessage = `${error}.${
              doDisplayHint ? ' ' + hint + (hintData ? ' ' + hintData : '') + '.' : ''
            }`;
            this.ref.markForCheck();
          })
        )
        .subscribe();
    }

    return this.errorMessage;
  }

  private getErrorCode(control: AbstractControl): string {
    if (control && control.invalid && control.errors) {
      const errors: string[] = Object.keys(control.errors);
      const errorCode: string = errors.length ? errors[0] : null;

      return errorCode && !!errorCode.length ? errorCode : null;
    }

    return null;
  }

  private getHintData(control: AbstractControl, errorCode: string): Observable<string> {
    const error = control.getError(errorCode);

    if (error) {
      switch (errorCode) {
        case 'differs':
          return this.cmTranslate.translate(error.mustMatch);
        case 'min':
          return of(error.min ? `${error.min}` : '');
        case 'invalidDeliveryTimespan':
          return error.minTimespanForDelivery
            ? this.cmTranslate
                .translate('MINUTES')
                .pipe(map((minutes) => `${error.minTimespanForDelivery} ${minutes.toLowerCase()}`))
            : of('');
        default:
          return of('');
      }
    }

    return of('');
  }

  private doDisplayHint(errorCode: string): boolean {
    return errorCode && errorHints.includes(errorCode) ? true : false;
  }
}
