import { AutoExpiringPromiseCache, promiseCache } from './promise-cache';

export { AutoExpiringPromiseCache, promiseCache } from './promise-cache';

export const FIVE_MINUTES = 1000 * 60 * 5;

export default function <K extends any = string, V extends any = unknown>(ttl: number): AutoExpiringPromiseCache<K, V> {
   return promiseCache<K, V>(ttl);
}
