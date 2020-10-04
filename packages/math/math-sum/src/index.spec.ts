import { sum, sumOf } from '.';

describe('package export', () => {
   it('adds alias for sum => sumOf', () => {
      expect(sum).toBe(sumOf);
   });

   it('sums', () => {
      expect(sum(1, 3, 6)).toBe(10);
      expect(sumOf(1, 3, 6)).toBe(10);
   });
});
