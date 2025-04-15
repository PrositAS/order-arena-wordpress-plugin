import { Time } from '@angular/common';
import { Injectable } from '@angular/core';
import { Moment, unitOfTime, utc } from 'moment';
import { CalendarClosedDate } from 'src/@types/order-arena-user-portal/CalendarClosedDate';
import { DeliveryTime } from 'src/@types/order-arena-user-portal/order-form/DeliveryTime';
import { isNullOrUndefined } from 'src/app/@core/utils';

@Injectable()
export class OrderTimeService {
  // NOTE: default opening and closing times disabled for now, may be enabled later
  // defaultOpeningTime: Time = {
  //   hours: 10,
  //   minutes: 0,
  // };
  // defaultClosingTime: Time = {
  //   hours: 17,
  //   minutes: 0,
  // };
  defaultDeliveryTimespan = 30;
  defaultMinutesStep = 15;

  getValidDeliveryTime(
    deliveryTime: DeliveryTime,
    minTimespanForDelivery: number,
    minDeliveryDate: Moment,
    calendarClosedDates: CalendarClosedDate[]
  ): Partial<DeliveryTime> {
    if (deliveryTime) {
      const closestDeliveryTime: Partial<DeliveryTime> = {};

      const setDeliveryDate = !!deliveryTime.date && !!minDeliveryDate;
      const setDeliveryStartTime = this.isValidTime(deliveryTime.deliveryStart);
      const setDeliveryEndTime = this.isValidTime(deliveryTime.deliveryEnd);
      const setDateTime = setDeliveryDate && setDeliveryStartTime;
      const setOnlyDate = setDeliveryDate && !setDeliveryStartTime;
      const setOnlyTime = !setDeliveryDate && setDeliveryStartTime;
      const notSetDateTime = !setDeliveryDate && !setDeliveryStartTime;
      const setEatingTime = this.isValidTime(deliveryTime.eatingTime);

      const deliveryStartMoment = setDeliveryStartTime
        ? this.getClosestValidDeliveryStartMoment(deliveryTime)
        : null;
      if (setDeliveryStartTime && deliveryStartMoment && deliveryStartMoment.isValid()) {
        closestDeliveryTime.deliveryStart = this.getTime(deliveryStartMoment);
      }

      const deliveryDateSource: Moment = setOnlyDate
        ? deliveryTime.date
        : setDateTime
        ? deliveryStartMoment
        : null;
      const deliveryDate = this.getClosestValidDeliveryDate(
        deliveryDateSource || utc(),
        minDeliveryDate || utc(),
        calendarClosedDates || []
      );
      closestDeliveryTime.date = deliveryDate;

      const deliveryEndTime = this.getValidDeliveryEndTime(
        deliveryTime,
        minTimespanForDelivery,
        deliveryStartMoment
      );
      if (setDeliveryEndTime && this.isValidTime(deliveryEndTime)) {
        closestDeliveryTime.deliveryEnd = deliveryEndTime;
      }

      const eatingTimeSource = setOnlyDate
        ? deliveryDate
        : setOnlyTime
        ? deliveryStartMoment
        : setDateTime
        ? deliveryDate
        : notSetDateTime
        ? minDeliveryDate || utc()
        : null;
      const eatingTime = setEatingTime
        ? this.getClosestValidEatingTime(deliveryTime, eatingTimeSource)
        : null;
      if (setEatingTime && this.isValidTime(eatingTime)) {
        closestDeliveryTime.eatingTime = eatingTime;
      }

      return closestDeliveryTime;
    }

    return null;
  }

  /** DELIVERY DATE */

  isValidDeliveryDate(date: Moment, minDate: Moment, calendarClosedDates: CalendarClosedDate[]): boolean {
    const now = utc();
    const minDeliveryDate: Moment = (minDate || now).clone();

    if (date.isValid()) {
      const day = date.clone();

      const isMinDeliveryDate = day.isSameOrAfter(minDeliveryDate, 'day') && day.isSameOrAfter(now, 'day');
      const isClosed =
        (calendarClosedDates || []).findIndex((closed) => closed.date.clone().isSame(day, 'day')) >= 0;

      return isMinDeliveryDate && !isClosed;
    }

    return false;
  }

  private getClosestValidDeliveryDate(
    date: Moment,
    minDate: Moment,
    calendarClosedDates: CalendarClosedDate[]
  ): Moment {
    const deliveryDate: Moment = date.isValid() ? date.clone() : null;
    const compareWith: Moment = minDate.clone() || utc();
    const closedDates = calendarClosedDates || [];

    if (deliveryDate) {
      if (!this.isValidDeliveryDate(deliveryDate, compareWith, closedDates)) {
        return this.getClosestValidDeliveryDate(
          deliveryDate.clone().add(1, 'days'),
          compareWith,
          closedDates
        );
      }

      return deliveryDate.startOf('day');
    }

    return compareWith.startOf('day');
  }

  /** DELIVERY START */

  isValidDeliveryStartMoment(
    deliveryTime: Partial<DeliveryTime>,
    deliveryStartMoment: Moment = null,
    closestDeliveryStartMoment: Moment = null
  ): boolean {
    if (!deliveryStartMoment && deliveryTime && !deliveryTime.date) {
      return true;
    }

    const deliveryStart =
      deliveryStartMoment && deliveryStartMoment.isValid()
        ? deliveryStartMoment
        : deliveryTime
        ? this.getMoment(deliveryTime.deliveryStart, deliveryTime.date)
        : null;

    if (deliveryStart && deliveryStart.isValid()) {
      const minutesToClosestDelivery = this.getMinutesToClosestDelivery(this.getTime(deliveryStart));

      if (minutesToClosestDelivery === 0) {
        const closestDeliveryStart: Moment =
          closestDeliveryStartMoment && closestDeliveryStartMoment.isValid()
            ? closestDeliveryStartMoment
            : this.getClosestDeliveryStartMoment(deliveryTime);
        const isValidByClosestDelivery = closestDeliveryStart
          ? this.isMomentSameOrAfterAndValid(deliveryStart, closestDeliveryStart)
          : true;
        const isValidByNow = this.isMomentSameOrAfterAndValid(deliveryStart, utc());

        return isValidByClosestDelivery && isValidByNow;
      }
    }

    return false;

    // NOTE: default opening and closing times disabled for now, may be enabled later
    // deliveryStartMoment.isSameOrBefore(this.getMoment(this.defaultClosingTime, closestDeliveryMoment))
  }

  getClosestValidDeliveryStartMoment(deliveryTime: Partial<DeliveryTime>): Moment {
    const closestDeliveryStartMoment: Moment = this.getClosestDeliveryStartMoment();
    const deliveryStartMoment: Moment = this.getClosestDeliveryStartMoment(deliveryTime);

    return this.isValidDeliveryStartMoment(deliveryTime, deliveryStartMoment, closestDeliveryStartMoment)
      ? deliveryStartMoment
      : closestDeliveryStartMoment;

    // NOTE: default opening and closing times disabled for now, may be enabled later
    // if (time.isBefore(openingDeliveryTime)) {
    //   return openingDeliveryTime;
    // } else if (time.isAfter(closingTime)) {
    //   return openingDeliveryTime.add(1, 'days');
    // }
  }

  getClosestDeliveryStartMoment(deliveryTime: Partial<DeliveryTime> = null): Moment {
    const now: Moment = utc();

    if (deliveryTime) {
      const deliveryDate: Moment = (
        deliveryTime.date && deliveryTime.date.isValid() ? deliveryTime.date : now
      )
        .clone()
        .startOf('day');

      return deliveryTime.deliveryStart && this.isValidTime(deliveryTime.deliveryStart)
        ? this.getMomentWithSpanFromTime(
            deliveryTime.deliveryStart,
            this.getMinutesToClosestDelivery(deliveryTime.deliveryStart),
            deliveryDate
          )
        : null;
    }

    return this.applyTimespan(this.getMinutesToClosestDelivery(this.getTime(now)), now);
  }

  getClosestDeliveryStartTime(deliveryTime: Partial<DeliveryTime> = null): Time {
    const moment = this.getClosestDeliveryStartMoment(deliveryTime);
    return this.getTime(moment);
  }

  getClosestValidDeliveryStartTime(deliveryTime: DeliveryTime): Time {
    const moment = this.getClosestValidDeliveryStartMoment(deliveryTime);
    return this.getTime(moment);
  }

  /** DELIVERY END */

  isValidDeliveryEndMoment(
    deliveryTime: Partial<DeliveryTime>,
    minTimespanForDelivery: number,
    deliveryEndMoment: Moment = null,
    closestDeliveryEndMoment: Moment = null
  ): boolean {
    const deliveryEnd: Moment = deliveryEndMoment
      ? deliveryEndMoment
      : deliveryTime
      ? this.getMoment(deliveryTime.deliveryEnd, deliveryTime.date)
      : null;

    if (deliveryEnd && deliveryEnd.isValid()) {
      const closestDeliveryEnd: Moment = closestDeliveryEndMoment
        ? closestDeliveryEndMoment
        : this.getClosestDeliveryEndMoment(deliveryTime, minTimespanForDelivery);

      const isValidByClosestDeliveryEnd = closestDeliveryEnd
        ? this.isMomentSameOrAfterAndValid(deliveryEnd, closestDeliveryEnd)
        : true;
      const isValidByNow = this.isMomentSameOrAfterAndValid(deliveryEnd, utc());

      return isValidByClosestDeliveryEnd && isValidByNow;
    }

    return false;
  }

  getClosestValidDeliveryEndMoment(
    deliveryTime: Partial<DeliveryTime>,
    minTimespanForDelivery = 0,
    deliveryStartMoment: Moment = null
  ): Moment {
    const closestDeliveryEnd: Moment = this.getClosestDeliveryEndMoment(
      deliveryTime,
      minTimespanForDelivery,
      deliveryStartMoment
    );

    if (minTimespanForDelivery >= 0) {
      const deliveryEnd: Moment = this.getMoment(deliveryTime.deliveryEnd, deliveryTime.date);

      if (
        this.isValidDeliveryEndMoment(deliveryTime, minTimespanForDelivery, deliveryEnd, closestDeliveryEnd)
      ) {
        return deliveryEnd;
      }
    }

    return closestDeliveryEnd && closestDeliveryEnd.isValid() ? closestDeliveryEnd : null;
  }

  getClosestDeliveryEndMoment(
    deliveryTime: Partial<DeliveryTime>,
    minTimespanForDelivery: number,
    deliveryStartMoment: Moment = null
  ): Moment {
    if (minTimespanForDelivery >= 0) {
      if (deliveryStartMoment && deliveryStartMoment.isValid()) {
        return this.applyTimespan(
          minTimespanForDelivery || this.defaultDeliveryTimespan,
          deliveryStartMoment
        );
      }

      if (deliveryTime && this.isValidTime(deliveryTime.deliveryStart)) {
        return this.getMomentWithSpanFromTime(
          deliveryTime.deliveryStart,
          minTimespanForDelivery,
          deliveryTime.date
        );
      }
    }

    return deliveryStartMoment && deliveryStartMoment.isValid() ? deliveryStartMoment : null;
  }

  getClosestDeliveryEndTime(
    deliveryTime: Partial<DeliveryTime>,
    minTimespanForDelivery: number,
    deliveryStartMoment: Moment = null
  ): Time {
    const moment = this.getClosestDeliveryEndMoment(
      deliveryTime,
      minTimespanForDelivery,
      deliveryStartMoment
    );

    return this.getTime(moment);
  }

  getValidDeliveryEndTime(
    deliveryTime: DeliveryTime,
    minTimespanForDelivery: number,
    deliveryStartMoment: Moment = null
  ): Time {
    const moment = this.getClosestValidDeliveryEndMoment(
      deliveryTime,
      minTimespanForDelivery,
      deliveryStartMoment
    );
    return this.getTime(moment);
  }

  /** EATING TIME */

  isValidEatingMoment(
    deliveryTime: Partial<DeliveryTime>,
    eatingMoment: Moment = null,
    deliveryEndMoment: Moment = null
  ): boolean {
    const eating: Moment =
      eatingMoment && eatingMoment.isValid()
        ? eatingMoment
        : this.getMoment(deliveryTime.eatingTime, deliveryTime.date);

    if (eating && eating.isValid()) {
      const deliveryStart: Moment = this.getClosestDeliveryStartMoment(deliveryTime);
      const closestEating: Moment = this.getClosestEatingMoment(deliveryTime, deliveryEndMoment);

      const isValidByDeliveryStart: boolean = deliveryStart
        ? this.isMomentSameOrAfterAndValid(eating, deliveryStart)
        : true;
      const isValidByClosestEating: boolean = closestEating
        ? this.isMomentSameOrAfterAndValid(eating, closestEating)
        : true;
      const isValidByNow = this.isMomentSameOrAfterAndValid(eating, utc());
      return isValidByDeliveryStart && isValidByClosestEating && isValidByNow;
    }

    return false;
  }

  getClosestValidEatingMoment(deliveryTime: Partial<DeliveryTime>, deliveryEndMoment: Moment = null): Moment {
    const closestEating: Moment = this.getClosestEatingMoment(deliveryTime, deliveryEndMoment);

    if (deliveryTime) {
      const eating: Moment = this.getMoment(deliveryTime.eatingTime, closestEating);

      return this.isValidEatingMoment(deliveryTime, eating, closestEating) ? eating : closestEating;
    }

    return closestEating && closestEating.isValid() ? closestEating : null;
  }

  getClosestEatingMoment(deliveryTime: Partial<DeliveryTime>, deliveryEndMoment: Moment = null): Moment {
    if (deliveryEndMoment && deliveryEndMoment.isValid()) {
      return deliveryEndMoment;
    }

    return deliveryTime && this.isValidTime(deliveryTime.deliveryEnd)
      ? this.getMoment(deliveryTime.deliveryEnd, deliveryTime.date)
      : null;
  }

  private getClosestValidEatingTime(deliveryTime: DeliveryTime, deliveryEndMoment: Moment = null): Time {
    return this.getTime(this.getClosestValidEatingMoment(deliveryTime, deliveryEndMoment));
  }

  /** SERVICE UTILS */

  getTime(moment: Moment): Time {
    return moment ? ({ hours: moment.hours(), minutes: moment.minutes() } as Time) : null;
  }

  isValidTime(time: Time): boolean {
    return time && !isNullOrUndefined(time.hours) && !isNullOrUndefined(time.minutes);
  }

  isEmptyTime(time: Time): boolean {
    return (time && time.hours === null && time.minutes === null) || time === null;
  }

  isValidOrEmptyTime(time: Time): boolean {
    return this.isValidTime(time) || this.isEmptyTime(time);
  }

  getMoment(time: Time, date: Moment = null): Moment {
    return this.isValidTime(time)
      ? (date && date.isValid() ? date.clone() : utc()).hours(time.hours).minutes(time.minutes)
      : null;
  }

  private getMomentWithSpanFromTime(
    time: Time,
    spanInMinutes = 0,
    date: Moment = null,
    before = false
  ): Moment {
    const moment: Moment = this.getMoment(time, date);

    return spanInMinutes >= 0 ? this.applyTimespan(spanInMinutes, moment, before) : moment;
  }

  private applyTimespan(spanInMinutes = 0, moment: Moment = null, before = false): Moment {
    if (moment && moment.isValid()) {
      const minTimespan: Time =
        spanInMinutes > 0
          ? ({
              hours: Math.floor(spanInMinutes / 60),
              minutes: spanInMinutes % 60,
            } as Time)
          : null;

      return this.isValidTime(minTimespan)
        ? before
          ? moment.clone().subtract(minTimespan.hours, 'hours').subtract(minTimespan.minutes, 'minutes')
          : moment.clone().add(minTimespan.hours, 'hours').add(minTimespan.minutes, 'minutes')
        : moment.clone();
    }

    return null;
  }

  private isMomentSameOrAfterAndValid(
    end: Moment,
    start: Moment,
    granularity: unitOfTime.StartOf = 'minute'
  ): boolean {
    return end && end.isValid() && start && start.isValid() ? end.isSameOrAfter(start, granularity) : false;
  }

  private getMinutesToClosestDelivery(time: Time = null): number {
    const minutesOverStep: number =
      (this.isValidTime(time) ? time : this.getTime(utc())).minutes % this.defaultMinutesStep;

    if (minutesOverStep > 0) {
      const minutesDifference = this.defaultMinutesStep - minutesOverStep;

      return minutesDifference <= Math.floor(this.defaultMinutesStep / 2)
        ? minutesDifference + this.defaultMinutesStep
        : minutesDifference;
    }

    return 0;
  }
}
