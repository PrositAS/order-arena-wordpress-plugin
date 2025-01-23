import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { combineLatest, Observable, tap } from 'rxjs';
import { CmTranslateService } from '../cm-translate/cm-translate.service';

@Injectable()
export class TranslatedSnackBarService {
  snackBarConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'end',
    verticalPosition: 'top',
  };
  constructor(
    private translate: CmTranslateService,
    private snackBar: MatSnackBar
  ) {}

  open(text: string, action = ''): void {
    if (typeof text === 'string' && !!text.length) {
      const textTranslation$: Observable<string> = this.translate.translate(text);
      const actionTranslation$: Observable<string> = this.translate.translate(action);

      combineLatest([textTranslation$, actionTranslation$])
        .pipe(
          tap(([text, action]) => {
            if (typeof text === 'string' && !!text.length) {
              this.snackBar.open(text, action, this.snackBarConfig);
            }
          })
        )
        .subscribe();
    }
  }
}
