import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, of, take } from 'rxjs';
import { camelToSnakeCase } from 'src/app/@core/utils';

@Injectable()
export class CmTranslateService {
  loaded$ = new BehaviorSubject<boolean>(false);

  constructor(private translateService: TranslateService) {}

  translate(key: string, prefix: string = null, suffix: string = null): Observable<string> {
    if (typeof key === 'string' && key.length > 0) {
      return this.translateService.get(this.prepareTranslationKey(key, prefix, suffix)).pipe(take(1));
    }

    return of('');
  }

  prepareTranslationKey(text: string, prefix: string = null, suffix: string = null): string {
    const parts: string[] = [];

    this.pushPart(parts, prefix);
    this.pushPart(parts, text);
    this.pushPart(parts, suffix);

    return camelToSnakeCase(parts.join('_')).toUpperCase();
  }

  private pushPart(parts: string[], text = '') {
    if (typeof text === 'string' && text.length > 0) {
      parts.push(text);
    }
  }
}
