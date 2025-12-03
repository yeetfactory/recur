import { createMMKV, MMKV } from 'react-native-mmkv';

// Mobile key-value storage client
export class MMKVClient {
  private storage: MMKV;

  constructor() {
    this.storage = createMMKV();
  }

  set<T>(key: string, value: T) {
    this.storage.set(key, JSON.stringify(value));
  }

  get<T>(key: string): T | null {
    const value = this.storage.getString(key);
    if (!value) {
      return null;
    }

    return JSON.parse(value);
  }

  delete(key: string) {
    this.storage.remove(key);
  }
}
