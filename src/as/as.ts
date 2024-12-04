/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

// Helper functions
function min(a: i32, b: i32, c: i32): i32 {
  let m = a < b ? a : b;
  return m < c ? m : c;
}

function max(a: i32, b: i32): i32 {
  return a > b ? a : b;
}

export function allocateString(str: string): StaticArray<u16> {
  const arr = new StaticArray<u16>(str.length);
  for (let i = 0; i < str.length; i++) {
    arr[i] = <u16>str.charCodeAt(i);
  }
  return arr;
}

export function levenshtein(a: StaticArray<u16>, b: StaticArray<u16>, aLen: i32, bLen: i32): f64 {
  if (aLen === 0)
    return bLen;
  if (bLen === 0)
    return aLen;

  // Ensure a is shorter
  if (bLen < aLen) {
    const temp = a;
    a = b;
    b = temp;
    const tempLen = aLen;
    aLen = bLen;
    bLen = tempLen;
  }

  // Create arrays for current and previous row
  const prev = new StaticArray<i32>(aLen + 1);
  const curr = new StaticArray<i32>(aLen + 1);

  // Initialize first row
  for (let i = 0; i <= aLen; i++) {
    prev[i] = i;
  }

  // Fill matrix
  for (let j: i32 = 1; j <= bLen; j++) {
    curr[0] = j;
    for (let i: i32 = 1; i <= aLen; i++) {
      const cost: i32 = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[i] = min(
        prev[i] + 1,      // deletion
        curr[i - 1] + 1,  // insertion
        prev[i - 1] + cost // substitution
      );
    }
    // Copy current to previous
    for (let i = 0; i <= aLen; i++) {
      prev[i] = curr[i];
    }
  }

  const distance: f64 = <f64>prev[aLen];
  return 1.0 - distance / <f64>max(aLen, bLen);
}
