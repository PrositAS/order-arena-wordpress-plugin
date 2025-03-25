/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export enum EVENTS {
  LOGIN,
  COMPLETE_ORDER,
}

@Injectable({
  providedIn: 'root',
})
export class BroadcasterService {
  constructor() {}

  on(channel): Observable<any> {
    return fromEvent(document, channel).pipe(map((e: CustomEventInit) => e.detail));
  }

  emit(channel, data) {
    document.dispatchEvent(new CustomEvent(channel, { detail: data }));
  }
}
