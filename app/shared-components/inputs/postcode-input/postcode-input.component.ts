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
import { postcodeValidator } from './validators/postcode.validator';

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
  selector: 'app-postcode-input',
  templateUrl: './postcode-input.component.html',
  styleUrls: ['./postcode-input.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: PostcodeInputComponent, multi: true }],
})
export class PostcodeInputComponent implements OnDestroy, MatFormFieldControl<string>, ControlValueAccessor {
  control!: AbstractControl<string>;

  @ViewChild('postcodeInput') postcodeInput: ElementRef;

  postcode: FormControl<string>;

  static nextId = 0;
  stateChanges = new Subject<void>();
  focused = false;
  touched = false;
  controlType = 'postcode-input';

  @HostBinding() id = `postcode-input-${PostcodeInputComponent.nextId++}`;

  onChange = (changes: string) => {};
  onTouched = () => {};

  get empty(): boolean {
    return !this.postcode || isNullOrUndefined(this.postcode.value);
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
    this._disabled ? this.postcode.disable() : this.postcode.enable();
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get value(): string {
    return this.postcode.value || null;
  }
  set value(value: string) {
    this.postcode.setValue(value);
    this.stateChanges.next();
  }

  get errorState(): boolean {
    return (
      (this.postcode.invalid && !!this.postcode.errors) || (this.control?.invalid && !!this.control?.errors)
    );
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

    this.postcode = new FormControl<string>(null, {
      validators: postcodeValidator(),
      updateOn: 'change',
    });
  }

  ngDoCheck() {
    if (this.postcode.touched) {
      return;
    }

    if (this.control) {
      if (this.control.touched && this.control.touched !== this.postcode.touched) {
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
    const controlElement = this._elementRef.nativeElement.querySelector('.postcode-input-container');

    if (controlElement) {
      controlElement.setAttribute('aria-describedby', ids.join(' '));
    }
  }

  onContainerClick() {
    if (this.postcodeInput) {
      this._focusMonitor.focusVia(this.postcodeInput, 'program');
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
    this.value = this.formatPostcode(this.value);
  }

  handleBlur() {
    this.control.setValue(this.value);
    if (this.postcode.errors) {
      this.control.setErrors(this.postcode.errors);
    }
  }

  private formatPostcode(value: string): string {
    if (value) {
      const postcode: string = value.replace(/\D/g, '');

      return postcode.length > 4 ? postcode.substring(0, 4) : postcode;
    }

    return '';
  }
}
