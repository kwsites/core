import { sum, sumBy, sumOf } from '.';

describe('package export', () => {
   it('adds alias for sum => sumOf', () => {
      expect(sum).toBe(sumOf);
   });

   it.each([
      ['sum', sum],
      ['sumOf', sumOf],
      ['sumBy', sumBy],
   ])('Root export for %s', (name, fn) => expect(fn).toEqual(expect.any(Function)));

   it('sums', () => {
      expect(sum(1, 3, 6)).toBe(10);
      expect(sumOf(1, 3, 6)).toBe(10);
   });
});
