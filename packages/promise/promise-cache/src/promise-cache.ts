export type AutoExpiringPromiseCache<K, T> = {
   get(key: K): Promise<T> | undefined;
   set(key: K, value: Promise<T>): typeof value;
   has(key: K): boolean;
};

type CacheExpiry = {
   cancel(): void;
   expire(): void;
};

export function promiseCache<K, T>(ttl: number): AutoExpiringPromiseCache<K, T> {
   const data = new Map<K, Promise<T>>();
   const cacheExpiry = new Map<K, CacheExpiry>();

   function cachePromise(key: K, value: Promise<T>) {
      const expiry: CacheExpiry = {
         cancel() {
            clearTimeout(timeoutId);
         },
         expire() {
            if (cacheExpiry.get(key) === expiry) {
               data.delete(key);
               cacheExpiry.delete(key);
            }
            expiry.cancel();
         },
      };
      const timeoutId = setTimeout(expiry.expire, ttl);

      if (typeof value?.catch === 'function') {
         value.catch(expiry.expire);
      }

      cacheExpiry.set(key, expiry);
      data.set(key, value);
   }

   return {
      get(key) {
         return data.get(key);
      },
      set(key, value) {
         cacheExpiry.get(key)?.cancel();
         cachePromise(key, value);

         return value;
      },
      has(key: K) {
         return data.has(key);
      },
   };
}
