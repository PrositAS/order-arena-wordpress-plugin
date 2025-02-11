import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { UPState } from 'src/@types/order-arena-user-portal/store/UPState';
import { setPluginSettingsAction } from 'src/app/@core/store/actions/plugin-settings';
import { environment } from 'src/environments/environment';

export type PluginSettings = {
  [key: string]: string;
};

@Injectable()
export class PluginSettingsService {
  constructor(
    private ngrx: Store<UPState>,
    private http: HttpClient
  ) {
    this.queryPluginSettings().subscribe();
  }

  get pluginSettings(): Observable<PluginSettings> {
    return this.ngrx.pipe(select((store) => store.pluginSettings));
  }

  getPluginSettings(): Observable<PluginSettings> {
    return this.pluginSettings.pipe(
      switchMap((pluginSettings) => (pluginSettings ? of(pluginSettings) : this.queryPluginSettings()))
    );
  }

  updateStylesPluginSettings(): void {
    const style = document.documentElement.style;

    this.getPluginSettings()
      .pipe(
        filter((settings) => settings !== null),
        tap((settings) =>
          Object.keys(settings)
            .filter((setting) => setting.includes('color'))
            .forEach((setting) => {
              const name: string = setting.replace(/oaup_/g, '--up-').replace(/_/g, '-');
              style.setProperty(name, settings[setting]);
            })
        )
      )
      .subscribe();
  }

  getImageUrl(type: string): Observable<string> {
    const settingName: string = `oaup_${type}_image`;
    return this.getPluginSettings().pipe(
      filter((settings) => settings && !!settings[settingName]),
      map((settings) => settings[settingName] ?? null)
    );
  }

  private queryPluginSettings(): Observable<PluginSettings> {
    return this.http
      .get<PluginSettings>(
        environment.pluginApi + environment.pluginApiNamespace + environment.pluginSettingsEndpoint
      )
      .pipe(
        take(1),
        map((result) => result ?? null),
        tap((pluginSettings) => {
          this.ngrx.dispatch(setPluginSettingsAction(pluginSettings));
        })
      );
  }
}
