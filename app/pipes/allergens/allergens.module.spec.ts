import { AllergensModule } from './allergens.module';

describe('AllergensModule', () => {
  let allergensModule: AllergensModule;

  beforeEach(() => {
    allergensModule = new AllergensModule();
  });

  it('should create an instance', () => {
    expect(allergensModule).toBeTruthy();
  });
});
