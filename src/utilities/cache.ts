export type CacheValue = { id: string; address: string };

export default class CacheService {
  private cache = new Map<string, CacheValue>();
  private static instance: CacheService | null = null;

  public static getInstance() {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  set(key: string, data: CacheValue): void {
    this.cache.set(key, data);
  }

  async get(key: string, callback: () => Promise<CacheValue>) {
    const entry = this.cache.get(key);

    if (!entry) {
      const newEntry = await callback();
      this.set(key, newEntry);
      return newEntry;
    }

    return entry;
  }

  delete(key: string) {
    this.cache.delete(key);
  }
}

export const cache = CacheService.getInstance();
