export interface PromiseFulfillmentResult<T> {
   result: T;
}

/**
 * The `PromiseSuccessResult` represents a `Promise` that fulfilled by resolving. The resolved
 * value is available as `promiseResult.value`.
 */
export type PromiseSuccessResult<R = void> =
   PromiseFulfillmentResult<R>
   & { success: true, threw: false, value: R, error?: null };

/**
 * The `PromiseFailureResult` represents a `Promise` that fulfilled by rejecting (or an `Error` was
 * thrown in the promise generating function). The `Error` / rejection value is available as
 * `promiseResult.error`.
 */
export type PromiseFailureResult<E extends Error = Error> =
   PromiseFulfillmentResult<E>
   & { success: false, threw: true, value?: undefined, error: E };

/**
 * The `PromiseResult` can be either a `PromiseSuccessResult` or `PromiseFailureResult`, with the
 * addition of `promiseResult.result` representing the fulfillment result  a `Promise` that fulfilled by rejecting (or an `Error` was
 * thrown in the promise generating function). The `Error` / rejection value is available as
 * `promiseResult.error`.
 */
export type PromiseResult<T, E extends Error> = PromiseSuccessResult<T> | PromiseFailureResult<E>;

const IsPromiseResult = Symbol('IsPromiseResult');

const fulfilledSuccess = Object.freeze(Object.defineProperty({
   success: true,
   threw: false,
   error: null,
}, IsPromiseResult, {value: true, enumerable: false, configurable: false}));

const fulfilledFailure = Object.freeze(Object.defineProperty({
   success: false,
   threw: true,
   value: undefined,
}, IsPromiseResult, {value: true, enumerable: false, configurable: false}));

/**
 * Converts the source promise into a `PromiseResult` representing the final fulfillment state of the promise.
 * The source promise can be pending or already fulfilled.
 *
 * ```typescript
 import { promiseResult } from '@kwsites/promise-result';

 const successful = await promiseResult<string>(Promise.resolve('Hello'));
 expect(successful).toEqual(expect.objectContaining({
   result: 'Hello',
   value: 'Hello',
   success: true,
   threw: false
 });

 const error = new Error('Some error');
 const failure = await promiseResult(Promise.reject(error));
 expect(result).toEqual(expect.objectContaining({
   result: error,
   error: error,
   success: false,
   threw: true,
 });
 ```
 */
export function promiseResult<T extends any = void, E extends Error = Error>(generator: Promise<T>): Promise<PromiseResult<T, E>> {
   return generator.then(successResult).catch(failureResult);
}

/**
 * Similar to the `promiseResult` method but returns just the rejection Error instance (or undefined when
 * the promise resolved rather than rejected).
 *
 * ```typescript
 import { promiseError } from '@kwsites/promise-result';

 // resolved promises have no error
 expect(await promiseError(Promise.resolve('Hello'))).toBeUndefined();

 // rejected promises resolve with their error
 const error = new Error('');
 expect(await promiseError(Promise.reject(error).toBe(error);
 ```
 */
export function promiseError<E extends Error = Error>(generator: Promise<any>): Promise<E | undefined> {
   return promiseResult<any, E>(generator).then(result => result.threw ? result.error : undefined);
}

/**
 * Creates a `PromiseResult` representing an already resolved promise
 */
export function promiseResultResolved<T>(resolved: T) {
   return promiseResult(Promise.resolve(resolved));
}

/**
 * Creates a `PromiseResult` representing an already rejected promise
 */
export function promiseResultRejected<E extends Error>(rejected: E) {
   return promiseResult(Promise.reject(rejected));
}

/**
 * Utility guard method used to assert the type of result was a success
 */
export function isPromiseSuccess<R = any>(test: any): test is PromiseSuccessResult<R> {
   return !!test && test[IsPromiseResult] === true && test.success;
}

/**
 * Utility guard method used to assert the type of result was a failure
 */
export function isPromiseFailure<R extends Error = Error>(test: any): test is PromiseFailureResult<R> {
   return !!test && test[IsPromiseResult] === true && test.threw;
}

function successResult<T>(value: T): PromiseSuccessResult<T> {
   return Object.create(fulfilledSuccess, {
      value: {value},
      result: {value},
   });
}

function failureResult<E extends Error>(value: E): PromiseFailureResult<E> {
   return Object.create(fulfilledFailure, {
      error: {value},
      result: {value},
   });
}
