import {
  chord,
  chordTypes,
  harmonicMinorDiatonicChords,
  majorDiatonicChords,
  melodicMinorDiatonicChords,
  naturalMinorDiatonicChords,
} from './chord'

describe('Chord', () => {
  describe('chordTypes', () => {
    it('should return chord types', () => {
      const types = chordTypes()
      expect(types.every((type) => 0 < chord('C3', type).length)).toEqual(true)
    })
  })

  describe('chord', () => {
    it.each([
      ['C3', '1', 'C3'],
      ['C#3', '1', 'C#3'],
      ['C3,G3', '5', 'C3'],
      ['D3,A3', '5', 'D3'],
      ['C3,D3,G3', 'sus2', 'C3'],
      ['D#3,F3,A#3', 'sus2', 'D#3'],
      ['C3,D#3,F#3', 'dim', 'C3'],
      ['C3,D#3,F#3', 'diminished', 'C3'],
      ['C3,D#3,F#3', 'i', 'C3'],
      ['E3,G3,A#3', 'dim', 'E3'],
      ['C3,D#3,G3', 'm', 'C3'],
      ['C3,D#3,G3', 'minor', 'C3'],
      ['F3,G#3,C4', 'm', 'F3'],
      ['C3,D#3,G#3', 'm+5', 'C3'],
      ['F#3,A3,D4', 'm+5', 'F#3'],
      ['C3,E3,G3', 'M', 'C3'],
      ['C3,E3,G3', '', 'C3'],
      ['C3,E3,G3', 'major', 'C3'],
      ['G3,B3,D4', 'M', 'G3'],
      ['C3,F3,G3', 'sus4', 'C3'],
      ['G#3,C#4,D#4', 'sus4', 'G#3'],
      ['C3,F3,G#3', 'aug', 'C3'],
      ['C3,F3,G#3', 'a', 'C3'],
      ['A3,D4,F4', 'aug', 'A3'],
      ['C3,D3,D#3,G3', 'madd2', 'C3'],
      ['A#3,C4,C#4,F4', 'madd2', 'A#3'],
      ['C3,D3,E3,G3', 'add2', 'C3'],
      ['B3,C#4,D#4,F#4', 'add2', 'B3'],
      ['C3,D3,G3,A#3', '7sus2', 'C3'],
      ['C#3,D#3,G#3,B3', '7sus2', 'C#3'],
      ['C3,D#3,F3,G3', 'madd4', 'C3'],
      ['D3,F3,G3,A3', 'madd4', 'D3'],
      ['C3,D#3,F#3,A3', 'dim7', 'C3'],
      ['D#3,F#3,A3,C4', 'dim7', 'D#3'],
      ['C3,D#3,F#3,A#3', 'm7-5', 'C3'],
      ['E3,G3,A#3,D4', 'm7-5', 'E3'],
      ['C3,D#3,G3,A3', 'm6', 'C3'],
      ['F3,G#3,C4,D4', 'm6', 'F3'],
      ['C3,D#3,G3,D4', 'madd9', 'C3'],
      ['F#3,A3,C#4,G#4', 'madd9', 'F#3'],
      ['C3,D#3,G3,F4', 'madd11', 'C3'],
      ['G3,A#3,D4,C5', 'madd11', 'G3'],
      ['C3,D#3,G3,A4', 'madd13', 'C3'],
      ['G#3,B3,D#4,F5', 'madd13', 'G#3'],
      ['C3,D#3,G3,A#3', 'm7', 'C3'],
      ['C3,D#3,G3,A#3', 'minor7', 'C3'],
      ['A3,C4,E4,G4', 'm7', 'A3'],
      ['C3,D#3,G3,B3', 'mM7', 'C3'],
      ['A#3,C#4,F4,A4', 'mM7', 'A#3'],
      ['C3,D#3,G#3,A#3', 'm7+5', 'C3'],
      ['B3,D4,G4,A4', 'm7+5', 'B3'],
      ['C3,E3,F3,G3', 'add4', 'C3'],
      ['C#3,F3,F#3,G#3', 'add4', 'C#3'],
      ['C3,E3,F#3,A#3', '7-5', 'C3'],
      ['D3,F#3,G#3,C4', '7-5', 'D3'],
      ['C3,E3,G3,A3', '6', 'C3'],
      ['D#3,G3,A#3,C4', '6', 'D#3'],
      ['C3,E3,G3,A#3', '7', 'C3'],
      ['C3,E3,G3,A#3', 'dom7', 'C3'],
      ['E3,G#3,B3,D4', '7', 'E3'],
      ['C3,E3,G3,B3', 'M7', 'C3'],
      ['C3,E3,G3,B3', 'maj7', 'C3'],
      ['C3,E3,G3,B3', 'major7', 'C3'],
      ['F3,A3,C4,E4', 'M7', 'F3'],
      ['C3,E3,G3,D4', 'add9', 'C3'],
      ['F#3,A#3,C#4,G#4', 'add9', 'F#3'],
      ['C3,E3,G3,F4', 'add11', 'C3'],
      ['G3,B3,D4,C5', 'add11', 'G3'],
      ['C3,E3,G3,A4', 'add13', 'C3'],
      ['G#3,C4,D#4,F5', 'add13', 'G#3'],
      ['C3,E3,G#3,A#3', '7+5', 'C3'],
      ['A3,C#4,F4,G4', '7+5', 'A3'],
      ['C3,E3,G#3,B3', 'M7+5', 'C3'],
      ['A#3,D4,F#4,A4', 'M7+5', 'A#3'],
      ['C3,F3,G3,A#3', '7sus4', 'C3'],
      ['B3,E4,F#4,A4', '7sus4', 'B3'],
      ['C3,D#3,G3,A3,D4', 'm6/9', 'C3'],
      ['C3,D#3,G3,A3,D4', 'm6,9', 'C3'],
      ['C#3,E3,G#3,A#3,D#4', 'm6/9', 'C#3'],
      ['C3,D#3,G3,A#3,C#4', 'm7-9', 'C3'],
      ['D3,F3,A3,C4,D#4', 'm7-9', 'D3'],
      ['C3,D#3,G3,A#3,D4', 'm9', 'C3'],
      ['D#3,F#3,A#3,C#4,F4', 'm9', 'D#3'],
      ['C3,D#3,G3,A#3,D#4', 'm7+9', 'C3'],
      ['E3,G3,B3,D4,G4', 'm7+9', 'E3'],
      ['C3,D#3,G3,A#3,F4', 'm11', 'C3'],
      ['F3,G#3,C4,D#4,A#4', 'm11', 'F3'],
      ['C3,D#3,G3,A#3,F#4', 'm11+', 'C3'],
      ['G3,A#3,D4,F4,C#5', 'm11+', 'G3'],
      ['C3,D#3,G3,A#3,A4', 'm13', 'C3'],
      ['G#3,B3,D#4,F#4,F5', 'm13', 'G#3'],
      ['C3,D#3,G#3,A#3,C#4', 'm7+5-9', 'C3'],
      ['A3,C4,F4,G4,A#4', 'm7+5-9', 'A3'],
      ['C3,D#3,G#3,A#3,D4', 'm9+5', 'C3'],
      ['A#3,C#4,F#4,G#4,C5', 'm9+5', 'A#3'],
      ['C3,E3,G3,A3,D4', '6/9', 'C3'],
      ['C3,E3,G3,A3,D4', '6,9', 'C3'],
      ['B3,D#4,F#4,G#4,C#5', '6/9', 'B3'],
      ['C3,E3,G3,A#3,C#4', '7-9', 'C3'],
      ['D#3,G3,A#3,C#4,E4', '7-9', 'D#3'],
      ['C3,E3,G3,A#3,D4', '9', 'C3'],
      ['E3,G#3,B3,D4,F#4', '9', 'E3'],
      ['C3,E3,G3,A#3,D#4', '7-10', 'C3'],
      ['F3,A3,C4,D#4,G#4', '7-10', 'F3'],
      ['C3,E3,G3,A#3,F4', '11', 'C3'],
      ['F#3,A#3,C#4,E4,B4', '11', 'F#3'],
      ['C3,E3,G3,A#3,F#4', '11+', 'C3'],
      ['G3,B3,D4,F4,C#5', '11+', 'G3'],
      ['C3,E3,G3,A#3,A4', '13', 'C3'],
      ['G#3,C4,D#4,F#4,F5', '13', 'G#3'],
      ['C3,E3,G3,B3,D4', 'maj9', 'C3'],
      ['A3,C#4,E4,G#4,B4', 'maj9', 'A3'],
      ['C3,E3,G#3,A#3,C#4', '7+5-9', 'C3'],
      ['A#3,D4,F#4,G#4,B4', '7+5-9', 'A#3'],
      ['C3,E3,G#3,A#3,D4', '9+5', 'C3'],
      ['B3,D#4,G4,A4,C#5', '9+5', 'B3'],
      ['C3,F3,G3,A#3,D4', '9sus4', 'C3'],
      ['C#3,F#3,G#3,B3,D#4', '9sus4', 'C#3'],
      ['C3,E3,G3,B3,D4,F4', 'maj11', 'C3'],
      ['D3,F#3,A3,C#4,E4,G4', 'maj11', 'D3'],
    ])(
      'should return notes %s if chord type is "%s" and root is "%s"',
      (expected: string, chordType: string, root: string) => {
        expect(chord(root, chordType).join(',')).toEqual(expected)
      }
    )
  })

  describe('majorDiatonicChord', () => {
    it('should return major diatonic chords of specified key', () => {
      expect(majorDiatonicChords('C4')).toEqual([
        ['C4', 'E4', 'G4', 'B4'],
        ['D4', 'F4', 'A4', 'C5'],
        ['E4', 'G4', 'B4', 'D5'],
        ['F4', 'A4', 'C5', 'E5'],
        ['G4', 'B4', 'D5', 'F5'],
        ['A4', 'C5', 'E5', 'G5'],
        ['B4', 'D5', 'F5', 'A5'],
      ])
    })
  })

  describe('naturalMinorDiatonicChord', () => {
    it('should return natural minor diatonic chords of specified key', () => {
      expect(naturalMinorDiatonicChords('A3')).toEqual([
        ['A3', 'C4', 'E4', 'G4'],
        ['B3', 'D4', 'F4', 'A4'],
        ['C4', 'E4', 'G4', 'B4'],
        ['D4', 'F4', 'A4', 'C5'],
        ['E4', 'G4', 'B4', 'D5'],
        ['F4', 'A4', 'C5', 'E5'],
        ['G4', 'B4', 'D5', 'F5'],
      ])
    })
  })

  describe('harmonicMinorDiatonicChord', () => {
    it('should return harmonic minor diatonic chords of specified key', () => {
      expect(harmonicMinorDiatonicChords('A3')).toEqual([
        ['A3', 'C4', 'E4', 'G#4'],
        ['B3', 'D4', 'F4', 'A4'],
        ['C4', 'E4', 'G#4', 'B4'],
        ['D4', 'F4', 'A4', 'C5'],
        ['E4', 'G#4', 'B4', 'D5'],
        ['F4', 'A4', 'C5', 'E5'],
        ['G#4', 'B4', 'D5', 'F5'],
      ])
    })
  })

  describe('melodicMinorDiatonicChord', () => {
    it('should return melodic minor diatonic chords of specified key', () => {
      expect(melodicMinorDiatonicChords('A3')).toEqual([
        ['A3', 'C4', 'E4', 'G#4'],
        ['B3', 'D4', 'F#4', 'A4'],
        ['C4', 'E4', 'G#4', 'B4'],
        ['D4', 'F#4', 'A4', 'C5'],
        ['E4', 'G#4', 'B4', 'D5'],
        ['F#4', 'A4', 'C5', 'E5'],
        ['G#4', 'B4', 'D5', 'F#5'],
      ])
    })
  })
})
