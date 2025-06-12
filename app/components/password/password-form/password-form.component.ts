import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldAppearance,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { take, tap } from 'rxjs';
import {
  PasswordUpdate,
  PasswordUpdateAction,
  PasswordUpdateForm,
} from 'src/@types/order-arena-user-portal/PasswordUpdate';
import { AuthService } from 'src/app/@core/auth.service';
import { sameValueValidator } from 'src/app/directives/validators/same-value.validator';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { ValidationErrorModule } from 'src/app/pipes/validation-error/validation-error.module';
import { OverlaySpinnerModule } from 'src/app/shared-components/overlay-spinner/overlay-spinner.module';

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
    MatButtonModule,

    // Prosit
    CmTranslateModule,
    ValidationErrorModule,

    OverlaySpinnerModule,
  ],
  selector: 'app-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss'],
})
export class PasswordFormComponent implements OnInit, AfterViewChecked {
  @Input() color: ThemePalette = 'primary';
  @Input() action: PasswordUpdateAction = 'set';
  @Input({ required: true }) inputToken: string;
  @Output() close = new EventEmitter<boolean>();

  appearance: MatFormFieldAppearance;

  token: FormControl<string>;
  password = new FormControl<string>(null, Validators.required);
  passwordConfirmation = new FormControl<string>(null, [
    Validators.required,
    sameValueValidator(this.password, 'password'),
  ]);
  form: FormGroup<PasswordUpdateForm>;

  afterViewChecked = false;
  hidePassword = true;
  validating = false;

  get controls(): PasswordUpdateForm {
    return this.form.controls;
  }

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.appearance = this.color === 'accent' ? 'fill' : 'outline';
    this.token = new FormControl<string>(this.inputToken, Validators.required);
    this.form = new FormGroup<PasswordUpdateForm>({
      token: this.token,
      password: this.password,
      passwordConfirmation: this.passwordConfirmation,
    });
  }

  ngAfterViewChecked(): void {
    this.afterViewChecked = true;
  }

  updatePassword(): void {
    this.validating = true;
    this.authService
      .setPassword(this.form.value as PasswordUpdate)
      .pipe(
        take(1),
        tap(() => {
          this.validating = false;
          this.close.emit(true);
        })
      )
      .subscribe();
  }
}
