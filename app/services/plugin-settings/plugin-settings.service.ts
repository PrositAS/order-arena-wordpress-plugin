import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { select, Store } from '@ngrx/store';
import { filter, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { UPState } from 'src/@types/order-arena-user-portal/store/UPState';
import { setPluginSettingsAction } from 'src/app/@core/store/actions/plugin-settings';
import { environment } from 'src/environments/environment';
import tinycolor from 'tinycolor2';

interface Color {
  name: string;
  hex: string;
  darkContrast: boolean;
}

interface ThemePalettes {
  primary: Palette;
  accent: Palette;
  warn: Palette;
}

interface Palette {
  palette: string;
  palette_accent: string;
}

export type PluginSettings = {
  [key: string]: string;
};

@Injectable()
export class PluginSettingsService {
  defaultThemePalettes: ThemePalettes = {
    primary: {
      palette: '#151e2c',
      palette_accent: '#2066ff',
    },
    accent: {
      palette: '#ffffff',
      palette_accent: '#ffffff',
    },
    warn: {
      palette: '#c8302c',
      palette_accent: '#ffa5a4',
    },
  };

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
          Object.keys(this.defaultThemePalettes).map((themePalette: ThemePalette) => {
            if (
              (settings[`oaup_${themePalette}_palette`] &&
                this.defaultThemePalettes[themePalette].palette !==
                  settings[`oaup_${themePalette}_palette`]) ||
              (settings[`oaup_${themePalette}_palette_accent`] &&
                this.defaultThemePalettes[themePalette].palette_accent !==
                  settings[`oaup_${themePalette}_palette_accent`])
            ) {
              const palette: Color[] = this.computeThemePalette(
                settings[`oaup_${themePalette}_palette`] ?? this.defaultThemePalettes[themePalette].palette,
                settings[`oaup_${themePalette}_palette_accent`] ??
                  this.defaultThemePalettes[themePalette].palette_accent
              );

              if (palette) {
                this.updateThemePalette(palette, themePalette);
              }
            }
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

  private updateThemePalette(colors: Color[], palette: ThemePalette) {
    colors.forEach((color) => {
      document.documentElement.style.setProperty(`--up-${palette}-color-${color.name}`, color.hex);
      document.documentElement.style.setProperty(
        `--up-${palette}-contrast-color-${color.name}`,
        tinycolor.mostReadable(color.hex, ['#ffffff', '#000000']).toHexString()
      );
    });
  }

  private computeThemePalette(primaryHex: string, accentHex: string): Color[] {
    if (!primaryHex || !accentHex) {
      return null;
    }

    return [
      this.getColorObject(tinycolor(primaryHex).lighten(52), '50'),
      this.getColorObject(tinycolor(primaryHex).lighten(37), '100'),
      this.getColorObject(tinycolor(primaryHex).lighten(26), '200'),
      this.getColorObject(tinycolor(primaryHex).lighten(12), '300'),
      this.getColorObject(tinycolor(primaryHex).lighten(6), '400'),
      this.getColorObject(tinycolor(primaryHex), '500'),
      this.getColorObject(tinycolor(primaryHex).darken(6), '600'),
      this.getColorObject(tinycolor(primaryHex).darken(12), '700'),
      this.getColorObject(tinycolor(primaryHex).darken(18), '800'),
      this.getColorObject(tinycolor(primaryHex).darken(24), '900'),
      this.getColorObject(tinycolor(accentHex).lighten(50), 'A100'),
      this.getColorObject(tinycolor(accentHex), 'A200'),
      this.getColorObject(tinycolor(accentHex).darken(20), 'A400'),
      this.getColorObject(tinycolor(accentHex).darken(50), 'A700'),
    ];
  }

  private getColorObject(value: tinycolor.Instance, name: string): Color {
    const c = tinycolor(value);
    return {
      name: name,
      hex: c.toHexString(),
      darkContrast: c.isLight(),
    };
  }
}
