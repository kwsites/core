import { sum } from '../src';

describe('sum', () => {
   it('summed numbers from array', () => {
      expect(sum([123, 456])).toBe(579);
      expect(sum([-10, 10])).toBe(0);
      expect(sum([1.5, -2.5])).toBe(-1);
   });

   it('summed numbers ignore NaN', () => {
      expect(sum([NaN, 456])).toBe(456);
      expect(sum(-10, NaN)).toBe(-10);
   });

   it('summed numbers allow for numbers rather than an array of numbers', () => {
      expect(sum(0, 456)).toBe(456);
      expect(sum(NaN, 10, -5, 'hello')).toBe(5);
   });

   it('summed numbers allow for spread rather than array of numbers', () => {
      const sumSpread = sum as any;
      expect(sumSpread(456, -56)).toBe(400);
   });

   it('removes non-numeric values', () => {
      expect(sum(15, 'hello', [], -5)).toBe(10);
      expect(sum(['hello', {}, -5, 20])).toBe(15);
   });

   it('initial array is ignored when there are other values', () => {
      expect(sum([15], 20)).toBe(20);
   });
});
