import { SaasClosedModule } from './saas-closed.module';

describe('SaasClosedModule', () => {
  let saasClosedModule: SaasClosedModule;

  beforeEach(() => {
    saasClosedModule = new SaasClosedModule();
  });

  it('should create an instance', () => {
    expect(saasClosedModule).toBeTruthy();
  });
});
