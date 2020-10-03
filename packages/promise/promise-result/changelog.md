
# Change Log

## 1.2.0
Add `error: null` to the `PromiseSuccessResult` and `value: undefined` to `PromiseFailureResult`
to allow for use as `const { value, error } = promiseResult(...)`

## 1.1.0
Add `promiseResultResolved` and `promiseResultRejected` to pre-create fulfilled results.
