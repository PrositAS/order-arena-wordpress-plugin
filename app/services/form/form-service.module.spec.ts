import { FormServiceModule } from './form-service.module';

describe('FormServiceModule', () => {
  let formServiceModule: FormServiceModule;

  beforeEach(() => {
    formServiceModule = new FormServiceModule();
  });

  it('should create an instance', () => {
    expect(formServiceModule).toBeTruthy();
  });
});
