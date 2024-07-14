import { randomNumber } from './number'

/**
 * Make shuffled array
 * @param array Source
 * @returns Shuffled
 */
const makeShuffled = <T>(array: readonly T[]): readonly T[] => {
  const source = [...array]
  const shuffled = []
  while (1 < source.length) {
    const index = randomNumber(source.length)
    shuffled.push(source[index])
    source.splice(index, 1)
  }
  shuffled.push(source[0])
  return shuffled
}

/**
 * Choose element randomly
 * @param array Source
 * @returns Chose value
 */
const choose = <T>(array: readonly T[]): T => array[randomNumber(array.length)]

/**
 * Array utilities
 */
export const Ary = Object.freeze({
  makeShuffled: Object.freeze(makeShuffled),
  choose: Object.freeze(choose),
} as const)

/**
 * Get iterator from first
 * @param array Source
 * @return Iterator
 */
function* fromFirst<T>(array: readonly T[]): Generator<T> {
  let index = 0
  while (true) {
    if (index === array.length) {
      index = 0
    }
    yield array[index++]
  }
}

/**
 * Get iterator from last
 * @param array Source
 * @return Iterator
 */
function* fromLast<T>(array: readonly T[]): Generator<T> {
  let index = array.length
  while (true) {
    if (index === 0) {
      index = array.length
    }
    yield array[--index]
  }
}

/**
 * Get round trip iterator
 * @param array Source
 * @param fromFirst From first
 * @return Iterator
 */
function* roundTrip<T>(
  array: readonly T[],
  fromFirst: boolean = true
): Generator<T> {
  let index = fromFirst ? 0 : array.length - 1
  let dir = fromFirst ? 1 : -1
  while (true) {
    const element = array[index]
    index += dir
    if (index === 0) {
      dir = 1
    } else if (index === array.length - 1) {
      dir = -1
    }
    yield element
  }
}

/**
 * Get shuffle iterator
 * @param array
 * @returns
 */
function* shuffle<T>(array: readonly T[]): Generator<T> {
  let shuffled = null
  let index = 0
  while (true) {
    if (shuffled === null || index === array.length) {
      shuffled = makeShuffled(array)
      index = 0
    }
    yield shuffled[index++]
  }
}

/**
 * Get random access iterator
 * @param array Source
 * @return Iterator
 */
function* random<T>(array: readonly T[]): Generator<T> {
  while (true) {
    yield array[randomNumber(array.length)]
  }
}

/**
 * Iteration utilities
 */
export const Itr = Object.freeze({
  fromFirst: Object.freeze(fromFirst),
  fromLast: Object.freeze(fromLast),
  roundTrip: Object.freeze(roundTrip),
  shuffle: Object.freeze(shuffle),
  random: Object.freeze(random),
} as const)
