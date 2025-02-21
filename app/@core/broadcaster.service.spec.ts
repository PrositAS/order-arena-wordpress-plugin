/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { inject, TestBed } from '@angular/core/testing';

import { BroadcasterService } from './broadcaster.service';

describe('BroadcasterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BroadcasterService],
    });
  });

  it('should be created', inject([BroadcasterService], (service: BroadcasterService) => {
    expect(service).toBeTruthy();
  }));
});
