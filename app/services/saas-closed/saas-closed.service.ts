import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import * as moment from 'moment';
import { Moment, utc } from 'moment';
import { extendMoment } from 'moment-range';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { CalendarClosedDate } from 'src/@types/order-arena-user-portal/CalendarClosedDate';
import { ClosedDate } from 'src/@types/order-arena-user-portal/ClosedDate';
import { UPState } from 'src/@types/order-arena-user-portal/store/UPState';
import { closedDatesQuery, setClosedDatesAction } from 'src/app/@core/store/actions/closed-dates';

const momentRange = extendMoment(moment);

@Injectable()
export class SaasClosedService {
  constructor(
    private ngrx: Store<UPState>,
    private http: Apollo
  ) {
    this.queryClosedDates(utc()).subscribe();
  }

  get closedDates(): Observable<ClosedDate[]> {
    return this.ngrx.pipe(select((store) => store.closedDates));
  }

  getClosedDates(): Observable<ClosedDate[]> {
    return this.closedDates.pipe(
      switchMap((closedDates) => (closedDates ? of(closedDates || []) : this.queryClosedDates(utc())))
    );
  }

  getCalendarClosedDates(): Observable<CalendarClosedDate[]> {
    return this.getClosedDates().pipe(
      map((closedDates: ClosedDate[]) => {
        if (!!closedDates?.length) {
          return closedDates.reduce((dates: CalendarClosedDate[], date: ClosedDate) => {
            const range = momentRange.range(moment(date.closedFrom), moment(date.closedTo));
            for (const d of range.by('day')) {
              dates.push({ date: d, message: date.message });
            }
            return dates;
          }, []);
        }

        return [];
      })
    );
  }

  queryClosedDates(from: Moment): Observable<ClosedDate[]> {
    return this.http
      .query<{ closedDates: ClosedDate[] }>({
        query: closedDatesQuery,
        context: { isPublic: true },
        variables: {
          filter: { closedFrom: from.toISOString(), closedTo: from.add(3, 'year').toISOString() },
        },
      })
      .pipe(
        map((result) => result.data.closedDates || []),
        tap((closedDates) => this.ngrx.dispatch(setClosedDatesAction(closedDates)))
      );
  }
}
