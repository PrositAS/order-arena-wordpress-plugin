/*
 * Copyright (c) 2023. Prosit A.S.
 */

export function isNullOrUndefined(v) {
  return v === undefined || v === null;
}

export function isObject(v) {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function isBoolean(v) {
  return typeof v === 'boolean';
}

export function camelToSnakeCase(camel: string): string {
  return camel ? camel.replace(/([a-z])([A-Z])/g, '$1_$2') : '';
}

export function isSameObject(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
