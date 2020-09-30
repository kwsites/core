
# @kwsites/promise-result

A utility to transform any promise into its fulfilled value whether it resolved or rejected.

## Usage

Capture the fulfillment result of a promise using `promiseResult`:

```typescript
import { promiseResult } from '@kwsites/promise-result';

const successValue = 'Good';
const errorValue = new Error('Bad');

expect(await promiseResult(Promise.resolve(successValue)))
  .toEqual(expect.objectContaining({
    result: successValue,
    value: successValue,
    success: true,
    threw: false
  }));

expect(await promiseResult(Promise.reject(errorValue)))
  .toEqual(expect.objectContaining({
    result: errorValue,
    error: errorValue,
    success: false,
    threw: true,
  }));
```

Capture just the rejection reason from a promise with `promiseError`:


```typescript
import { promiseError } from '@kwsites/promise-result';

const successValue = 'Good';
const errorValue = new Error('Bad');

expect(await promiseError(Promise.resolve(successValue)))
    .toBeUndefined();

expect(await promiseError(Promise.reject(errorValue)))
  .toBe(errorValue);
```

