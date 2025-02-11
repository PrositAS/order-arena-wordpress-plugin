/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { animate, style, transition, trigger } from '@angular/animations';

export const ToastInOutAnimation = [
  trigger('fadeInOut', [
    transition(':enter', [
      style({
        opacity: 0,
        transform: 'translateX(150px)',
      }),
      animate(
        100,
        style({
          opacity: 1,
          transform: 'translateX(0px)',
        })
      ),
    ]),
    transition(':leave', [
      animate(
        100,
        style({
          opacity: 0,
          transform: 'translateX(150px)',
        })
      ),
    ]),
  ]),
];
