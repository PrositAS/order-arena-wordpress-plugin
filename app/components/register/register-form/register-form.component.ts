import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldAppearance,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { catchError, take, tap } from 'rxjs';
import {
  UserRegisterCredentials,
  UserRegisterCredentialsForm,
} from 'src/@types/order-arena-user-portal/UserRegisterCredentials';
import { AuthService } from 'src/app/@core/auth.service';
import { sameValueValidator } from 'src/app/directives/validators/same-value.validator';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { ValidationErrorModule } from 'src/app/pipes/validation-error/validation-error.module';
import { TranslatedSnackBarService } from 'src/app/services/translated-snack-bar/translated-snack-bar.service';
import { PhoneInputComponent } from 'src/app/shared-components/inputs/phone-input/phone-input.component';
import { OverlaySpinnerModule } from 'src/app/shared-components/overlay-spinner/overlay-spinner.module';
import { pluginPagesPaths } from 'src/environments/plugin-config';

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
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,

    // Prosit
    CmTranslateModule,
    ValidationErrorModule,

    OverlaySpinnerModule,
    PhoneInputComponent,
  ],
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent implements OnInit, AfterViewChecked {
  @Input() color: ThemePalette = 'primary';
  @Output() registered = new EventEmitter<boolean>();

  appearance: MatFormFieldAppearance;

  password = new FormControl<string>(null, Validators.required);
  passwordConfirmation = new FormControl<string>(null, [
    Validators.required,
    sameValueValidator(this.password, 'password'),
  ]);
  form = new FormGroup<UserRegisterCredentialsForm>({
    email: new FormControl<string>(null, [Validators.required, Validators.email]),
    phone: new FormControl<string>(null, []),
    name: new FormControl<string>(null, Validators.required),
    surname: new FormControl<string>(null, Validators.required),
    password: this.password,
    passwordConfirmation: this.passwordConfirmation,
  });
  gdpr = new FormControl<boolean>(false, { validators: Validators.requiredTrue });

  afterViewChecked = false;
  hidePassword = true;
  validating = false;
  emailExists = false;

  termsUrl: string = window.location.origin + pluginPagesPaths.terms;

  get controls(): UserRegisterCredentialsForm {
    return this.form.controls;
  }

  get email(): FormControl<string> {
    return this.controls.email;
  }

  get phone(): FormControl<string> {
    return this.controls.phone;
  }

  get name(): FormControl<string> {
    return this.controls.name;
  }

  get surname(): FormControl<string> {
    return this.controls.surname;
  }

  constructor(
    private authService: AuthService,
    private snackBarService: TranslatedSnackBarService
  ) {}

  ngOnInit(): void {
    this.appearance = this.color === 'accent' ? 'fill' : 'outline';
  }

  ngAfterViewChecked(): void {
    this.afterViewChecked = true;
  }

  register(): void {
    this.validating = true;
    this.authService
      .register(this.form.value as UserRegisterCredentials)
      .pipe(
        take(1),
        tap((registered) => {
          this.validating = false;
          if (registered) {
            this.emailExists = false;
            this.snackBarService.open('USER_CREATED', 'OK');
            this.registered.emit(true);
          }
        }),
        catchError((error) => {
          this.validating = false;
          if (error === 'Email has already been taken') {
            this.emailExists = true;
            this.snackBarService.open('EMAIL_ALREADY_TAKEN', 'OK');
            this.email.setErrors({ alreadyTaken: true });
          }

          return error;
        })
      )
      .subscribe();
  }
}
