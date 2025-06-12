/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { of } from 'rxjs';
import { AuthService } from '../../../@core/auth.service';
import { ModalModule } from '../../modal/modal.module';

import { OrdersService } from './orders.service';

describe('ActionFlowsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalModule, ApolloTestingModule],
      providers: [
        provideMockStore({}),
        OrdersService,
        {
          provide: AuthService,
          useValue: {
            loggedIn: of(false),
          },
        },
      ],
    });
  });

  it('should be created', inject([OrdersService], (service: OrdersService) => {
    expect(service).toBeTruthy();
  }));
});
