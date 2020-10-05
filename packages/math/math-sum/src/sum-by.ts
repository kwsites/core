import { MaybeNumber } from './types';
import { sum } from './sum';

export function sumBy<T>(inputs: T[], valueFn: (input: T, index: number, inputs: T[]) => MaybeNumber): number {
   return sum(inputs.map(valueFn));
}
