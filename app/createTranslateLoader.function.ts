import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.pluginApiNamespace}${environment.pluginTranslationsEndpoint}/`,
    ''
  );
}
