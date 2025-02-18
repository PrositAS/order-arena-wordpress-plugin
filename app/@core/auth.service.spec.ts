/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { ApolloTestingModule } from 'apollo-angular/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule, HttpClientTestingModule],
      providers: [provideMockStore({}), provideOAuthClient()],
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
