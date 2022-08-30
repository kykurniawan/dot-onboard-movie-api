import { Cache } from 'cache-manager';

export async function clearCache(key: string, cacheManager: Cache) {
  const keys: string[] = await cacheManager.store.keys();
  keys.forEach((k) => {
    if (k.startsWith(key)) {
      cacheManager.del(k);
    }
  });
}
