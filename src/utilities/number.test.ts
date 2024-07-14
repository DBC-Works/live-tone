import { Nmb } from './number'

describe('Number', () => {
  describe('randomNumber', () => {
    it('should return integer value less than n', () => {
      for (let count = 0; count < 100; ++count) {
        expect(Nmb.randomNumber(100)).toBeLessThan(100)
      }
    })
  })

  describe('randomInRange', () => {
    it('should return integer value between begin and end - 1', () => {
      for (let count = 0; count < 100; ++count) {
        const actual = Nmb.randomInRange(10, 99)
        expect(actual).toBeGreaterThanOrEqual(10)
        expect(actual).toBeLessThan(99)
      }
    })
  })

  describe('oneIn', () => {
    it('should return boolean value', () => {
      let hit = false
      while (hit === false) {
        hit = Nmb.oneIn(10)
      }

      let miss = false
      while (miss === false) {
        miss = Nmb.oneIn(10) === false
      }
      expect(hit).toEqual(true)
      expect(miss).toEqual(true)
    })
  })
})
