import { bisect } from '../src/bisect';

describe('bisect', () => {
   it('inserts before first value', () => {
      expect(bisect([1, 5, 10, 20], 0)).toBe(0);
      expect(bisect([1, 5, 10, 20], -1)).toBe(0);
   });

   it('inserts above last value', () => {
      expect(bisect([1, 5, 10, 20], 20)).toBe(4);
      expect(bisect([1, 5, 10, 20], 21)).toBe(4);
   });

   it('inserts after index of matching value', () => {
      expect(bisect([1, 5, 10, 20], 1)).toBe(1);
      expect(bisect([1, 5, 10, 20], 5)).toBe(2);
      expect(bisect([1, 5, 10, 20], 10)).toBe(3);
   });
});
