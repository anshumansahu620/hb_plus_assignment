import { Platform } from 'react-native';

/**
 * Cross-platform storage abstraction:
 * - Uses window.localStorage on Web
 * - Uses in-memory fallback if storage is restricted or on native without AsyncStorage
 */
class CrossPlatformStorage {
  private memoryStore: Map<string, string> = new Map();

  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return this.memoryStore.get(key) || null;
    } catch {
      return this.memoryStore.get(key) || null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      this.memoryStore.set(key, value);
    } catch {
      this.memoryStore.set(key, value);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      this.memoryStore.delete(key);
    } catch {
      this.memoryStore.delete(key);
    }
  }
}

export const appStorage = new CrossPlatformStorage();
