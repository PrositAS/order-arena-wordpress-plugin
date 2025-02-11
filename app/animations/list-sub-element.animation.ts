/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { animate, query, sequence, style, transition, trigger } from '@angular/animations';

export const ListSubElement = [
  trigger('sub', [
    transition('void => *', [
      sequence([
        query('.item', [style({ opacity: 0 })], { optional: true }),
        query(
          ':enter',
          [
            style({
              overflow: 'hidden',
              'max-height': 0,
            }),
            animate('0.1s ease-in-out', style({ 'max-height': 300 })),
          ],
          { optional: true }
        ),
        query('.item', [animate('0.1s ease-in-out', style({ opacity: 1 }))], { optional: true }),
      ]),
    ]),
    transition('* => void', [
      sequence([
        query('.item', [animate('0.1s ease-in-out', style({ opacity: 0 }))], { optional: true }),
        query(
          ':leave',
          [style({ 'max-height': 300 }), animate('0.1s ease-in-out', style({ 'max-height': 0 }))],
          { optional: true }
        ),
      ]),
    ]),
  ]),
];
