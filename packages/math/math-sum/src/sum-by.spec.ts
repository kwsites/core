import { sumBy } from './sum-by';

describe('sum-by', () => {
   it('sums', () => {
      expect(sumBy([[1], [3], [5]], (src) => src[0])).toBe(9);
   });

   it('ignores non-number values', () => {
      expect(sumBy([{ num: 1 }, {}, { num: 3 }], (src) => src.num)).toBe(4);
   });
});
