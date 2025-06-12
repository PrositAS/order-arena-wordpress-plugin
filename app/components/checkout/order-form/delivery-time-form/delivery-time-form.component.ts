import { CommonModule, Time } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MatMomentDateModule,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatCalendarCellCssClasses, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import * as moment from 'moment';
import { Moment } from 'moment';
import { MomentModule } from 'ngx-moment';
import { Observable, tap } from 'rxjs';
import { CalendarClosedDate } from 'src/@types/order-arena-user-portal/CalendarClosedDate';
import { DeliveryTimeForm } from 'src/@types/order-arena-user-portal/order-form/DeliveryTime';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';
import { ValidationErrorModule } from 'src/app/pipes/validation-error/validation-error.module';
import { OrderFormServiceModule } from 'src/app/services/order/order-form/order-form-service.module';
import { OrderFormService } from 'src/app/services/order/order-form/order-form.service';
import { TimeInputModule } from 'src/app/shared-components/inputs/time-input/time-input.module';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,
    MomentModule,

    // Angular Material
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMomentDateModule,
    MatDatepickerModule,

    // Prosit
    CmTranslateModule,
    ValidationErrorModule,
    OrderFormServiceModule,

    TimeInputModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'no' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  selector: 'app-delivery-time-form',
  templateUrl: './delivery-time-form.component.html',
  styleUrls: ['./delivery-time-form.component.scss'],
})
export class DeliveryTimeFormComponent implements OnInit, OnDestroy {
  @Input({ required: true }) form!: FormGroup<DeliveryTimeForm>;
  @Input() isEquipmentDelivery: boolean;

  dispose: any[] = [];

  closedDates: CalendarClosedDate[] = [];
  closedDates$: Observable<CalendarClosedDate[]>;

  minDeliveryDate$: Observable<Moment>;

  destroyRef = inject(DestroyRef);

  get controls(): DeliveryTimeForm {
    return this.form.controls;
  }

  get date(): FormControl<Moment> {
    return this.controls.date;
  }

  get deliveryStart(): FormControl<Time> {
    return this.controls.deliveryStart;
  }

  get deliveryEnd(): FormControl<Time> {
    return this.controls.deliveryEnd;
  }

  get eatingTime(): FormControl<Time> {
    return this.controls.eatingTime;
  }

  constructor(
    private orderFormService: OrderFormService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.minDeliveryDate$ = this.orderFormService.minDeliveryDate$.pipe(takeUntilDestroyed(this.destroyRef));
    this.closedDates$ = this.orderFormService.calendarClosedDates$.pipe(
      tap((dates) => (this.closedDates = dates))
    );
  }

  disabledDatesFilter = (date: Moment): boolean => {
    return !this.findClosedDate(date);
  };

  styleDisabledDates = (date: Moment): MatCalendarCellCssClasses => {
    const closedDate: CalendarClosedDate = this.findClosedDate(date);

    if (closedDate && closedDate.message) {
      return 'calendar-cell-message';
    }
  };

  datepickerOpened() {
    setTimeout(() => {
      const calendarNavButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll<HTMLButtonElement>(
        'mat-calendar.delivery-date .mat-calendar-controls button.mat-calendar-previous-button,mat-calendar.delivery-date .mat-calendar-controls button.mat-calendar-next-button'
      );

      calendarNavButtons.forEach((button) => {
        const dispose = this.renderer.listen(button, 'click', () => this.setClosedDateMessage());
        this.dispose.push(dispose);
      });

      this.setClosedDateMessage();
    });
  }

  private findClosedDate(date: Moment): CalendarClosedDate {
    return date && date.isValid()
      ? this.closedDates.find(
          (dd: CalendarClosedDate) => dd.date.format('DD.MM.YYYY') === date.format('DD.MM.YYYY')
        )
      : null;
  }

  private setClosedDateMessage() {
    const calendar: HTMLElement = document.querySelector('.delivery-date');
    const dateCells: NodeListOf<HTMLButtonElement> = calendar.querySelectorAll(
      'button.mat-calendar-body-cell.mat-calendar-body-disabled.calendar-cell-message'
    );

    dateCells.forEach((dateCell) => {
      const closedDate: CalendarClosedDate = this.findClosedDate(
        moment(new Date(dateCell.getAttribute('aria-label')))
      );

      if (closedDate && closedDate.message) {
        this.renderer.setProperty(dateCell, 'title', closedDate.message);
      }
    });
  }

  ngOnDestroy() {
    this.dispose.forEach((dispose) => dispose());
  }
}
