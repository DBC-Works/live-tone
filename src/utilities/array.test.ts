import { Ary, Itr } from './array'

describe('Array', () => {
  const TEST_SOURCE = ['A', 'B', 'C', 'D', 'E']

  describe('makeShuffled', () => {
    it('should return shuffled array', () => {
      // arrange & act
      let actual
      // eslint-disable-next-line no-constant-condition
      while (true) {
        actual = [...Ary.makeShuffled(TEST_SOURCE)]
        if (TEST_SOURCE.join() !== actual.join()) {
          break
        }
      }

      // assert
      expect(actual).toHaveLength(TEST_SOURCE.length)
      actual.sort()
      expect(actual.join()).toEqual(TEST_SOURCE.join())
    })
  })
})

describe('Iteration', () => {
  const TEST_SOURCE = ['A', 'B', 'C', 'D', 'E']

  describe('fromFirst', () => {
    it('should return iterator from first', () => {
      // arrange & act
      const it = Itr.fromFirst(TEST_SOURCE)

      // assert
      for (const element of TEST_SOURCE) {
        expect(it.next().value).toEqual(element)
      }
      const next = it.next()
      expect(next.done).toEqual(false)
      expect(next.value).toEqual(TEST_SOURCE[0])
    })
  })

  describe('fromLast', () => {
    it('should return iterator from last', () => {
      // arrange & act
      const it = Itr.fromLast(TEST_SOURCE)

      // assert
      const reverse = [...TEST_SOURCE].reverse()
      for (const element of reverse) {
        expect(it.next().value).toEqual(element)
      }
      const next = it.next()
      expect(next.done).toEqual(false)
      expect(next.value).toEqual(TEST_SOURCE[TEST_SOURCE.length - 1])
    })
  })

  describe('roundTrip', () => {
    it('should return round trip iterator ', () => {
      // arrange
      const source = [...TEST_SOURCE].concat([...TEST_SOURCE].reverse())

      // act
      const it = Itr.roundTrip(source)

      // assert
      for (const element of source) {
        expect(it.next().value).toEqual(element)
      }
      const next = it.next()
      expect(next.done).toEqual(false)
      expect(next.value).toEqual(source[1])
    })
  })

  describe('shuffle', () => {
    it('should return shuffle iterator', () => {
      // arrange
      const source = [...TEST_SOURCE]

      // act
      const it = Itr.shuffle(source)

      // assert
      while (0 < source.length) {
        const element = it.next().value
        const index = source.findIndex((x) => x === element)
        expect(index).toBeGreaterThanOrEqual(0)
        source.splice(index, 1)
      }
      const next = it.next()
      expect(next.done).toEqual(false)
    })
  })

  describe('random', () => {
    it('should return random iterator', () => {
      // arrange
      const source = [...TEST_SOURCE]

      // act
      const it = Itr.random(source)

      // assert
      while (0 < source.length) {
        const element = it.next().value
        const index = source.findIndex((x) => x === element)
        if (0 <= index) {
          source.splice(index, 1)
        }
      }
      const next = it.next()
      expect(next.done).toEqual(false)
    })
  })
})
