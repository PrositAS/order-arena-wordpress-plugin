import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldAppearance,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { map, merge, Observable, shareReplay, startWith, Subject, switchMap, tap } from 'rxjs';
import { UserCredentials, UserCredentialsForm } from 'src/@types/order-arena-user-portal/UserCredentials';
import { AuthService } from 'src/app/@core/auth.service';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { ValidationErrorModule } from 'src/app/pipes/validation-error/validation-error.module';
import { TranslatedSnackBarService } from 'src/app/services/translated-snack-bar/translated-snack-bar.service';
import { OverlaySpinnerModule } from 'src/app/shared-components/overlay-spinner/overlay-spinner.module';
import { ResetPasswordButtonComponent } from '../../password/reset-password-button/reset-password-button.component';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,

    // Angular Material
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,

    // Prosit
    CmTranslateModule,
    ValidationErrorModule,

    OverlaySpinnerModule,
    ResetPasswordButtonComponent,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', hideRequiredMarker: true },
    },
  ],
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit, AfterViewChecked {
  @Input() color: ThemePalette = 'primary';
  @Output() validated = new EventEmitter<boolean>();

  loggedIn$: Observable<boolean>;
  loginCredentials$ = new Subject<UserCredentials>();
  validating$: Observable<boolean>;

  appearance: MatFormFieldAppearance;
  form = new FormGroup<UserCredentialsForm>({
    username: new FormControl<string>(null, [Validators.required, Validators.email]),
    password: new FormControl<string>(null, Validators.required),
  });

  afterViewChecked = false;
  hidePassword = true;
  invalidGrants = false;

  destroyRef = inject(DestroyRef);

  get controls(): UserCredentialsForm {
    return this.form.controls;
  }

  get username(): FormControl<string> {
    return this.controls.username;
  }

  get password(): FormControl<string> {
    return this.controls.password;
  }

  constructor(
    private authService: AuthService,
    private snackBarService: TranslatedSnackBarService
  ) {
    const logged$: Observable<boolean> = this.loginCredentials$.pipe(
      switchMap((creds) => this.authService.login(creds)),
      map((res) => !this.handleLoginError(res)),
      shareReplay(1)
    );

    this.validating$ = merge(
      this.loginCredentials$.pipe(map(() => true)),
      logged$.pipe(map(() => false))
    ).pipe(startWith(false));
  }

  ngOnInit(): void {
    this.appearance = this.color === 'accent' ? 'fill' : 'outline';

    this.loggedIn$ = this.authService.loggedIn.pipe(
      takeUntilDestroyed(this.destroyRef),
      startWith(false),
      tap((loggedIn) => {
        if (loggedIn) {
          this.validated.emit(true);
          this.form.disable;
        } else {
          this.form.enable;
        }
        this.form.updateValueAndValidity();
      })
    );
    this.loggedIn$.subscribe();
  }

  ngAfterViewChecked(): void {
    this.afterViewChecked = true;
  }

  login(): void {
    this.loginCredentials$.next(this.form.getRawValue());
  }

  handleLoginError(e: string | null): ValidationErrors | null {
    const error = this.parseLoginError(e);

    if (error === null) {
      this.invalidGrants = false;
      this.snackBarService.open('VALID_CREDENTIALS', 'OK');
      this.validated.emit(true);
    } else {
      if (error.invalidCredentials) {
        this.invalidGrants = true;
        this.snackBarService.open('INVALID_CREDENTIALS', 'OK');
        this.password.setErrors(error);
      } else {
        this.form.setErrors(error);
      }
    }

    return error;
  }

  parseLoginError(e: string | null): ValidationErrors | null {
    if (e) {
      switch (e) {
        case 'INVALID_GRANT':
          return { invalidCredentials: true } as ValidationErrors;
        case 'INACTIVE_CUSTOMER':
          return { inactiveCustomer: true } as ValidationErrors;
        default:
          return { unknownError: true } as ValidationErrors;
      }
    }

    return null;
  }
}
