import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormField, MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { isNullOrUndefined } from 'src/app/@core/utils';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { phoneValidator, trimPhone } from './validators/phone.validator';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,

    // Angular Material
    MatFormFieldModule,

    // Prosit
    CmTranslateModule,
  ],
  selector: 'app-phone-input',
  templateUrl: './phone-input.component.html',
  styleUrls: ['./phone-input.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: PhoneInputComponent, multi: true }],
})
export class PhoneInputComponent implements OnDestroy, MatFormFieldControl<string>, ControlValueAccessor {
  control!: AbstractControl<string>;

  @ViewChild('phoneInput') phoneInput: ElementRef;

  phone: FormControl<string>;

  static nextId = 0;
  stateChanges = new Subject<void>();
  focused = false;
  touched = false;
  controlType = 'phone-input';

  @HostBinding() id = `phone-input-${PhoneInputComponent.nextId++}`;

  onChange = (changes: string) => {};
  onTouched = () => {};

  get empty(): boolean {
    return !this.phone || isNullOrUndefined(this.phone.value);
  }

  @HostBinding('class.floating')
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  @Input('aria-describedby') userAriaDescribedBy: string;

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder: string;

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.phone.disable() : this.phone.enable();
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get value(): string {
    return this.phone.value || null;
  }
  set value(value: string) {
    this.phone.setValue(value);
    this.stateChanges.next();
  }

  get errorState(): boolean {
    return (this.phone.invalid && !!this.phone.errors) || (this.control?.invalid && !!this.control?.errors);
  }

  constructor(
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() public parentFormField: MatFormField,
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
      setTimeout(() => {
        this.control = this.ngControl.control;
      });
    }

    this.phone = new FormControl<string>(null, {
      validators: phoneValidator(),
      updateOn: 'change',
    });
  }

  ngDoCheck() {
    if (this.phone.touched) {
      return;
    }

    if (this.control) {
      if (this.control.touched && this.control.touched !== this.phone.touched) {
        this.touched = true;
        this.onTouched();
        this.stateChanges.next();
      }
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  onFocusIn(event: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  onFocusOut(event: FocusEvent) {
    if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }

  autoFocusNext(): void {
    if (!this.control.errors) {
      this.focused = false;
    }
  }

  autoFocusPrev(): void {
    if (this.control.value === null) {
      this.focused = false;
    }
  }

  setDescribedByIds(ids: string[]) {
    const controlElement = this._elementRef.nativeElement.querySelector('.phone-input-container');

    if (controlElement) {
      controlElement.setAttribute('aria-describedby', ids.join(' '));
    }
  }

  onContainerClick() {
    if (this.phoneInput) {
      this._focusMonitor.focusVia(this.phoneInput, 'program');
    }
  }

  writeValue(value: string) {
    this.value = value || null;
  }

  patchValue(value: string) {
    this.value = value || null;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  handleInput() {
    this.value = this.formatPhone(this.value);
  }

  handleBlur() {
    this.control.setValue(this.value);
    if (this.phone.errors) {
      this.control.setErrors(this.phone.errors);
    }
  }

  private formatPhone(value: string): string {
    if (value && value.length >= 1) {
      const trimmedPhone = trimPhone(value);

      if (trimmedPhone) {
        const phoneLength: number = trimmedPhone.length;
        const firstDigit: string = trimmedPhone[0];

        switch (firstDigit) {
          case '+': {
            return phoneLength > 3
              ? `${trimmedPhone.slice(0, 3)} ${trimmedPhone.slice(3, 11).replace(/\d{2}(?=.)/g, '$& ')}`
              : trimmedPhone;
          }
          case '0': {
            if (trimmedPhone[1] === '0' && trimmedPhone[2] !== '0') {
              const areaCode: string = trimmedPhone.slice(0, 4);
              return phoneLength > 4
                ? `${areaCode} ${trimmedPhone.slice(4, 12).replace(/\d{2}(?=.)/g, '$& ')}`
                : areaCode;
            }

            return firstDigit;
          }
          default: {
            if (phoneLength <= 5) {
              return trimPhone(trimmedPhone);
            }

            return trimmedPhone.slice(0, 8).replace(/\d{2}(?=.)/g, '$& ');
          }
        }
      }

      return trimmedPhone;
    }
  }
}
