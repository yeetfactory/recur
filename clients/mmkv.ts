import { createMMKV, MMKV } from 'react-native-mmkv';
import { Logger } from './logger';

const logger = new Logger('MMKV Client');

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

    try {
      return JSON.parse(value);
    } catch (error) {
      logger.error('Failed to parse MMKV value for key: ' + key, error);
      return null;
    }
  }

  delete(key: string) {
    this.storage.remove(key);
  }
}
