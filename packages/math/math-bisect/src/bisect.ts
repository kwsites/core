enum BisectResult {
   BELOW,
   EQUAL,
   ABOVE,
}

function check(test: number, needle: number): BisectResult {
   if (test === needle) {
      return BisectResult.EQUAL;
   }

   return test > needle ? BisectResult.ABOVE : BisectResult.BELOW;
}

function mid(lower: number, upper: number) {
   return lower + (upper - lower) / 2;
}

export function bisect(haystack: number[], needle: number): number {
   if (!haystack.length || needle < haystack[0]) {
      return 0;
   }

   let min = 0;
   let max = haystack.length - 1;

   if (needle >= haystack[max]) {
      return max + 1;
   }

   while (max !== min) {
      const range = max - min;
      const midPoint = Math.ceil(mid(min, range));
      const midValue = haystack[midPoint];

      if (midPoint === min) {
         return min + 1;
      }

      if (midPoint === max) {
         return max;
      }

      switch (check(midValue, needle)) {
         case BisectResult.EQUAL:
            return midPoint + 1;
         case BisectResult.ABOVE:
            if (range < 1) {
               return midPoint;
            }
            max = midPoint;
            break;
         case BisectResult.BELOW:
            if (range < 1) {
               return midPoint + 1;
            }
            min = midPoint;
            break;
      }
      //
      // if (midValue === needle) {
      //    return midPoint + 1;
      // }
      //
      // if (midValue > needle) {
      //    max = midPoint;
      // } else {
      //    min = midPoint;
      // }
   }

   return 0;
}
