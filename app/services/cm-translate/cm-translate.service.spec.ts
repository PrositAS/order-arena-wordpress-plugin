import { inject, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CmTranslateService } from './cm-translate.service';

describe('CmTranslateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule],
      providers: [CmTranslateService],
    });
  });

  it('should be created', inject([CmTranslateService], (service: CmTranslateService) => {
    expect(service).toBeTruthy();
  }));
});
