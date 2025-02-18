import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { Moment, utc } from 'moment';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SaasSettings } from 'src/@types/order-arena-user-portal/SaasSettings';
import { UPState } from 'src/@types/order-arena-user-portal/store/UPState';
import { setSettingsAction, settingsQuery } from 'src/app/@core/store/actions/settings';

@Injectable({ providedIn: 'root' })
export class SaasSettingsService {
  constructor(
    private http: Apollo,
    private ngrx: Store<UPState>
  ) {
    this.querySettings().subscribe();
  }

  get settings(): Observable<SaasSettings> {
    return this.ngrx.pipe(select((store) => store.settings));
  }

  getSettings(): Observable<SaasSettings> {
    return this.settings.pipe(
      switchMap((settings) => {
        if (Object.keys(settings || {}).length === 0) {
          return this.querySettings();
        }

        return of(settings);
      })
    );
  }

  getMinDaysBefore(): Observable<number> {
    return this.getSettings().pipe(map((settings) => settings.customerEditOrderDaysBeforeClosing || 0));
  }

  getMinDeliveryDate(): Observable<Moment> {
    return this.getSettings().pipe(
      map((settings) =>
        utc()
          .add(settings.customerEditOrderDaysBeforeClosing || 0, 'days')
          .startOf('day')
      )
    );
  }

  getMinTimespanForDelivery(): Observable<number> {
    return this.getSettings().pipe(map((settings) => settings.minTimespanForDelivery));
  }

  getTerms(): Observable<string> {
    return this.getSettings().pipe(map((settings) => settings.terms || null));
  }

  querySettings(): Observable<SaasSettings> {
    return this.http
      .query<{ settings: SaasSettings }>({
        query: settingsQuery,
      })
      .pipe(
        map((result) => ({ ...result.data.settings })),
        tap((settings) => this.ngrx.dispatch(setSettingsAction(settings)))
      );
  }
}
