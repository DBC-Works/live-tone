/**
 * Get random number([0, n))
 * @param n Limit(not include)
 * @returns Random number
 */
export const randomNumber = (n: number): number => Math.floor(Math.random() * n)

/**
 * Get random number([begin, end))
 * @param begin Begin(may be included)
 * @param end End(not include)
 * @returns Random number
 */
export const randomInRange = (begin: number, end: number): number =>
  begin + randomNumber(end - begin)

/**
 * Return true with a probability of 1/n
 * @param n Denominator
 * @returns Result
 */
export const oneIn = (n: number): boolean => randomNumber(n) === 0

/**
 * Number utilities
 */
export const Nmb = {
  randomNumber,
  randomInRange,
  oneIn,
} as const
