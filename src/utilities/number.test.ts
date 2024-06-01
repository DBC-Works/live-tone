import { oneIn, randomInRange, randomNumber } from './number'

describe('Number', () => {
  describe('randomNumber', () => {
    it('should return integer value less than n', () => {
      for (let count = 0; count < 100; ++count) {
        expect(randomNumber(100)).toBeLessThan(100)
      }
    })
  })

  describe('randomInRange', () => {
    it('should return integer value between begin and end - 1', () => {
      for (let count = 0; count < 100; ++count) {
        const actual = randomInRange(10, 99)
        expect(actual).toBeGreaterThanOrEqual(10)
        expect(actual).toBeLessThan(99)
      }
    })
  })

  describe('oneIn', () => {
    it('should return boolean value', () => {
      let hit = false
      while (hit === false) {
        hit = oneIn(10)
      }

      let miss = false
      while (miss === false) {
        miss = oneIn(10) === false
      }
      expect(hit).toEqual(true)
      expect(miss).toEqual(true)
    })
  })
})
