import { MaybeNumber, MaybeNumbers } from './types';

export function sum(...numbers: MaybeNumbers): number;
export function sum(numbers: MaybeNumbers): number;
export function sum(...input: MaybeNumbers | [MaybeNumbers]): number {
   return getSumOfNumbers(Array.isArray(input[0]) && input.length === 1 ? input[0] : input);
}

function isNumber(test: MaybeNumber): test is number {
   return typeof test === 'number' && test === test;
}

function getSumOfNumbers(numbers: MaybeNumbers): number {
   return numbers.reduce((count: number, current: number | unknown) => {
      return count + (isNumber(current) ? current : 0);
   }, 0);
}
