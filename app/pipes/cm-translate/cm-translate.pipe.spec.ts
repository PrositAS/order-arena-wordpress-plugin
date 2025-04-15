/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { CmTranslatePipe } from './cm-translate.pipe';

describe('CmTranslatePipe', () => {
  const translatePipe = TranslateService.prototype;
  const changeRef = ChangeDetectorRef.prototype;
  changeRef.markForCheck = () => {};
  translatePipe.get = (v) => of(v);
  it('create an instance', () => {
    const pipe = new CmTranslatePipe(translatePipe, changeRef);
    expect(pipe).toBeTruthy();
  });

  it('should remove low dash if translate fails', () => {
    const input = 'some_string';
    const expected = 'some string';
    const pipe = new CmTranslatePipe(translatePipe, changeRef);
    const output = pipe.transform(input, false);
    expect(output).toEqual(expected);
  });

  it('should return properly translated string', () => {
    const input = 'some_string';
    const expected = 'some string';
    translatePipe.get = () => of(expected);
    const pipe = new CmTranslatePipe(translatePipe, changeRef);
    const output = pipe.transform(input, false);
    expect(output).toEqual(expected);
  });
});
