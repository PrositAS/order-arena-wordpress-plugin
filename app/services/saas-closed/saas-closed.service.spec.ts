import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { SaasClosedService } from './saas-closed.service';

describe('SaasClosedService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [provideMockStore({}), SaasClosedService],
    })
  );

  it('should be created', () => {
    const service: SaasClosedService = TestBed.get(SaasClosedService);
    expect(service).toBeTruthy();
  });
});
