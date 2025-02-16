/*
 * Copyright (c) 2020. Prosit A.S.
 */

import { ToDatePipe } from './to-date.pipe';

describe('ToDatePipe', () => {
  it('create an instance', () => {
    const pipe = new ToDatePipe();
    expect(pipe).toBeTruthy();
  });
});
