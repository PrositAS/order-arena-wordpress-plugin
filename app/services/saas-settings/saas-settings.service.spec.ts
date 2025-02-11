/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { SaasSettingsService } from './saas-settings.service';

describe('SaasSettingsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule, HttpClientTestingModule],
      providers: [provideMockStore({}), provideOAuthClient(), SaasSettingsService],
    })
  );

  it('should be created', () => {
    const service: SaasSettingsService = TestBed.get(SaasSettingsService);
    expect(service).toBeTruthy();
  });
});
