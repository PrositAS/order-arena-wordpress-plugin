import { CmTranslateServiceModule } from './cm-translate-service.module';

describe('CmTranslateServiceModule', () => {
  let cmTranslateServiceModule: CmTranslateServiceModule;

  beforeEach(() => {
    cmTranslateServiceModule = new CmTranslateServiceModule();
  });

  it('should create an instance', () => {
    expect(cmTranslateServiceModule).toBeTruthy();
  });
});
