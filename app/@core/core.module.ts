import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import 'moment/locale/nb';
import { Observable, take, tap } from 'rxjs';
import { createTranslateLoader } from '../createTranslateLoader.function';
import { CmTranslateModule } from '../pipes/cm-translate/cm-translate.module';
import { CmTranslateService } from '../services/cm-translate/cm-translate.service';
import { ApolloApiModule } from './api';
import { OAuthSetupModule } from './oauthSetup.module';
import { UPStoreModule } from './store/up-store.module';

@NgModule({
  imports: [
    OAuthSetupModule,
    ApolloApiModule,
    BrowserModule,
    BrowserAnimationsModule,
    UPStoreModule,
    TranslateModule.forRoot({
      useDefaultLang: true,
      defaultLanguage: 'nb',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    CmTranslateModule,
  ],
})
export class CoreModule {
  private availableLanguages = ['en-gb', 'nb'];

  constructor(
    private translate: TranslateService,
    private cmTranslateService: CmTranslateService
  ) {
    this.initTranslate()
      .pipe(
        tap(() => this.cmTranslateService.loaded$.next(true)),
        take(1)
      )
      .subscribe();
  }

  initTranslate(): Observable<any> {
    let browserLang = this.translate.getBrowserCultureLang();
    browserLang = browserLang === 'no' ? 'nb' : browserLang;
    const isBrowserLangSupported = 0 && this.availableLanguages.includes(browserLang);
    const selectedLang = isBrowserLangSupported ? browserLang : 'nb';
    moment.locale(selectedLang);

    return this.translate.use(selectedLang);
  }
}
