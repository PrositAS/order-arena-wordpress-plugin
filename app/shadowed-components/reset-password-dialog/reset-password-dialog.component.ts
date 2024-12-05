import { CommonModule } from '@angular/common';
import { Component, Inject, Input, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { catchError, of, take, tap } from 'rxjs';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { ValidationErrorModule } from 'src/app/pipes/validation-error/validation-error.module';
import { TranslatedSnackBarServiceModule } from 'src/app/services/translated-snack-bar/translated-snack-bar-service.module';
import { TranslatedSnackBarService } from 'src/app/services/translated-snack-bar/translated-snack-bar.service';
import { AuthService } from '../../@core/auth.service';

export interface DialogData {
  email: string;
}

@Component({
  standalone: true,
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', hideRequiredMarker: true },
    },
  ],
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,

    // Angular Material
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,

    // Prosit
    CmTranslateModule,
    ValidationErrorModule,
    TranslatedSnackBarServiceModule,
  ],
  selector: 'app-reset-password-dialog',
  templateUrl: './reset-password-dialog.component.html',
  styleUrls: ['./reset-password-dialog.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ResetPasswordDialogComponent {
  @Input() color: ThemePalette = 'primary';

  email = new FormControl<string>(this.data ? this.data.email || null : null, [
    Validators.required,
    Validators.email,
  ]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private authService: AuthService,
    private snackBarService: TranslatedSnackBarService
  ) {}

  resetPassword() {
    if (this.email && this.email.valid) {
      this.authService
        .resetPassword(this.email.value)
        .pipe(
          take(1),
          tap((res) => {
            this.snackBarService.open('PASSWORD_RESET_SUCCESS_CHECK_EMAIL', 'OK');
            return res;
          }),
          catchError((error) => {
            this.snackBarService.open('UNABLE_TO_RESET_PASSWORD', 'OK');

            return of('error', error);
          })
        )
        .subscribe();
    }
  }
}
