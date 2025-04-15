/*
 * Copyright (c) 2019. Prosit A.S.
 */

type logTypes = 'log' | 'error' | 'warn' | 'info';

import { environment } from '../../environments/environment';

export class Logger {
  static new(type: logTypes, ...args) {
    if (!environment.production) {
      console.group(`%c NEW ${type.toUpperCase()}`, this.stylesFor(type));
      args.forEach((arg) => {
        if (typeof arg === 'string') {
          console[type](`%c, ${arg}`, this.stylesFor(type));
        } else {
          console[type](...args);
        }
      });
      console.log('%c --------------------------------------', this.stylesFor(type));
      console.groupEnd();
    } else {
      console[type]('...');
    }
  }

  static log(...args) {
    Logger.new('log', ...args);
  }

  static warn(...args) {
    Logger.new('warn', ...args);
  }

  static info(...args) {
    Logger.new('info', ...args);
  }

  static error(...args) {
    Logger.new('error', ...args);
  }

  private static stylesFor(type): string {
    let style = 'font-size: 20px; font-weight: bolder; padding: 20px 0';
    switch (type) {
      case 'log':
        style = style + '; color: black';
        break;
      case 'warn':
        style = style + '; color: orange';
        break;
      case 'info':
        style = style + '; color: blue';
        break;
      case 'error':
        style = style + '; color: red';
        break;
    }
    return style;
  }
}
