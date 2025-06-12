import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Time } from '@angular/common';
import {
  AfterViewInit,
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
  FormGroup,
  NgControl,
  Validators,
} from '@angular/forms';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { TimeForm, TimePart } from 'src/@types/order-arena-user-portal/order-form/Time';
import { isNullOrUndefined } from 'src/app/@core/utils';

@Component({
  selector: 'app-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: TimeInputComponent, multi: true }],
})
export class TimeInputComponent
  implements AfterViewInit, OnDestroy, MatFormFieldControl<Time>, ControlValueAccessor
{
  control!: AbstractControl<Time>;

  @Input() minutesInterval: number = null;

  @ViewChild('hours') hoursInput: ElementRef;
  @ViewChild('minutes') minutesInput: ElementRef;

  time: FormGroup<TimeForm>;

  static nextId = 0;
  stateChanges = new Subject<void>();
  focused = false;
  touched = false;
  controlType = 'time-input';

  @HostBinding() id = `time-input-${TimeInputComponent.nextId++}`;

  onChange = (changes: Partial<Time>) => {};
  onTouched = () => {};

  get empty(): boolean {
    const {
      value: { hours, minutes },
    } = this.time;

    return !this.time || (hours === null && minutes === null);
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
    this._disabled ? this.time.disable() : this.time.enable();
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get value(): Time | null {
    const time: Time = { ...this.time.value } as Time;
    return time || null;
  }
  set value(value: Time | null) {
    this.time.setValue(value || { hours: null, minutes: null });
    this.formatControl('hours', this.time.value.hours);
    this.formatControl('minutes', this.time.value.minutes);
    this.stateChanges.next();
  }

  get errorState(): boolean {
    return (this.time.invalid && !!this.time.errors) || (this.control?.invalid && !!this.control?.errors);
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

    this.time = new FormGroup<TimeForm>({
      hours: new FormControl<number>(null, [
        Validators.required,
        Validators.maxLength(2),
        Validators.min(0),
        Validators.max(23),
      ]),
      minutes: new FormControl<number>(null, [
        Validators.required,
        Validators.maxLength(2),
        Validators.min(0),
        Validators.max(59),
      ]),
    });
  }

  ngAfterViewInit(): void {
    this.formatControl('hours', this.time.value.hours);
    this.formatControl('minutes', this.time.value.minutes);
  }

  ngDoCheck() {
    if (this.time.touched) {
      return;
    }

    if (this.control) {
      if (this.control.touched !== this.time.touched) {
        this.touched = this.control.touched;
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

  autoFocusNext(partControl: FormControl<number>, nextElement: ElementRef = null): void {
    if (!partControl.errors) {
      if (nextElement) {
        this._focusMonitor.focusVia(nextElement, 'program');
        nextElement.nativeElement.select();
      } else {
        this.focused = false;
      }
    }
  }

  autoFocusPrev(partControl: FormControl<number>, prevElement: ElementRef = null): void {
    if (partControl.value === null) {
      if (prevElement) {
        this._focusMonitor.focusVia(prevElement, 'program');
        prevElement.nativeElement.select();
      } else {
        this.focused = false;
      }
    }
  }

  setDescribedByIds(ids: string[]) {
    const controlElement = this._elementRef.nativeElement.querySelector('.time-input-container');

    if (controlElement) {
      controlElement.setAttribute('aria-describedby', ids.join(' '));
    }
  }

  onContainerClick() {
    this._focusMonitor.focusVia(this.hoursInput, 'program');
    this.hoursInput.nativeElement.select();
  }

  writeValue(time: Time | null) {
    this.value = time;
  }

  patchValue(time: Time | null) {
    this.value = { ...this.value, ...time };
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

  handleInput(part: TimePart, partControl: FormControl<number>, nextElement: ElementRef = null) {
    this.value = this.validateValueTime(part);

    if (this.value[part] >= 10) {
      this.autoFocusNext(partControl, nextElement);
    }

    this.onChange(this.value);
  }

  handleBlur(partControl: FormControl<number>, nextElement: ElementRef = null) {
    this.autoFocusNext(partControl, nextElement);
    this.control.setValue(this.value);
  }

  private validateValueTime(part: TimePart): Time {
    const time: Time = { ...this.value };

    switch (part) {
      case 'hours': {
        time.hours = !isNullOrUndefined(this.value.hours)
          ? this.value.hours < 0
            ? 0
            : this.value.hours > 23
            ? 23
            : this.value.hours
          : null;

        break;
      }
      case 'minutes': {
        time.minutes = !isNullOrUndefined(this.value.minutes)
          ? this.value.minutes < 0
            ? 0
            : this.value.minutes > 59
            ? 59
            : this.value.minutes
          : null;

        break;
      }
    }

    return time;
  }

  private formatControl(part: TimePart, value: number) {
    if (value !== null && value < 10) {
      switch (part) {
        case 'hours': {
          if (this.hoursInput && this.hoursInput.nativeElement) {
            this.hoursInput.nativeElement.value = this.formatTime(value);
          }
          break;
        }
        case 'minutes': {
          if (this.minutesInput && this.minutesInput.nativeElement) {
            this.minutesInput.nativeElement.value = this.formatTime(value);
          }
          break;
        }
      }
    }
  }

  private formatTime(value: number): string {
    return (value >= 0 && value < 10 ? `0${value}` : `${value}`).slice(0, 2);
  }
}
