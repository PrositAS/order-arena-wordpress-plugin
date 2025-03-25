/*
 * Copyright (c) 2019. Prosit A.S.
 */

class InMemoryStorage implements Storage {
  storageObj = {};

  constructor(initState = {}) {
    this.storageObj = initState;
  }

  getItem(key) {
    return this.storageObj[key];
  }

  setItem(key, value) {
    this.storageObj[key] = value;
  }

  key(n) {
    return Object.keys(this.storageObj)[n];
  }

  removeItem(key) {
    delete this.storageObj[key];
  }

  clear() {
    this.storageObj = {};
  }

  [ name: string ]: any;

  public readonly length: number;
}

export class CustomStorage implements Storage {
  memStorage = new InMemoryStorage({});

  constructor(private tryStorage: 'localStorage' | 'sessionStorage') {}

  get storage() {
    let storage;
    try {
      storage = window[this.tryStorage];
    } catch (e) {
      storage = this.memStorage;
    }
    return storage;
  }

  getItem(key) {
    return this.storage.getItem(key);
  }

  setItem(key, value) {
    this.storage.setItem(key, value);
  }

  removeItem(key) {
    this.storage.removeItem(key);
  }

  key(n) {
    return this.storage.key(n);
  }

  clear() {
    this.storage.clear();
  }

  [ name: string ]: any;

  public readonly length: number;
}
