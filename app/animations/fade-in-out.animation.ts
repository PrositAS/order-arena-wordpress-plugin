/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { animate, query, sequence, style, transition, trigger } from '@angular/animations';

export const FadeInOutAnimation = [
  trigger('fadeInOut', [
    transition('void => *', [
      sequence([
        query('*', [style({ opacity: 0 })], { optional: true }),
        query(
          ':self',
          [
            style({
              'max-height': 37,
            }),
            animate('0.1s ease-in-out', style({ 'max-height': 320 })),
          ],
          { optional: true }
        ),
        query('*', [animate('0.1s ease-in-out', style({ opacity: 1 }))], { optional: true }),
      ]),
    ]),
    transition('* => void', [
      sequence([
        query(':self', [style({ opacity: 1 }), animate('0.1s ease-in-out', style({ opacity: 0 }))], {
          optional: true,
        }),
      ]),
    ]),
  ]),
];
