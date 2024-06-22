import { Scale, ScaleInfo } from './scale'

/**
 * Code structure
 */
const ChordStructure: Record<string, number[]> = {
  M: [0, 4, 7],

  '1': [0],
  '5': [0, 7],
  sus2: [0, 2, 7],
  dim: [0, 3, 6],
  m: [0, 3, 7],
  'm+5': [0, 3, 8],
  sus4: [0, 5, 7],
  aug: [0, 5, 8],
  madd2: [0, 2, 3, 7],
  add2: [0, 2, 4, 7],
  '7sus2': [0, 2, 7, 10],
  madd4: [0, 3, 5, 7],
  dim7: [0, 3, 6, 9],
  'm7-5': [0, 3, 6, 10],
  m6: [0, 3, 7, 9],
  madd9: [0, 3, 7, 14],
  madd11: [0, 3, 7, 17],
  madd13: [0, 3, 7, 21],
  m7: [0, 3, 7, 10],
  mM7: [0, 3, 7, 11],
  'm7+5': [0, 3, 8, 10],
  add4: [0, 4, 5, 7],
  '7-5': [0, 4, 6, 10],
  '6': [0, 4, 7, 9],
  '7': [0, 4, 7, 10],
  M7: [0, 4, 7, 11],
  add9: [0, 4, 7, 14],
  add11: [0, 4, 7, 17],
  add13: [0, 4, 7, 21],
  '7+5': [0, 4, 8, 10],
  'M7+5': [0, 4, 8, 11],
  '7sus4': [0, 5, 7, 10],
  'm6/9': [0, 3, 7, 9, 14],
  'm7-9': [0, 3, 7, 10, 13],
  m9: [0, 3, 7, 10, 14],
  'm7+9': [0, 3, 7, 10, 15],
  m11: [0, 3, 7, 10, 17],
  'm11+': [0, 3, 7, 10, 18],
  m13: [0, 3, 7, 10, 21],
  'm7+5-9': [0, 3, 8, 10, 13],
  'm9+5': [0, 3, 8, 10, 14],
  '6/9': [0, 4, 7, 9, 14],
  '7-9': [0, 4, 7, 10, 13],
  '9': [0, 4, 7, 10, 14],
  '7-10': [0, 4, 7, 10, 15],
  '11': [0, 4, 7, 10, 17],
  '11+': [0, 4, 7, 10, 18],
  '13': [0, 4, 7, 10, 21],
  maj9: [0, 4, 7, 11, 14],
  '7+5-9': [0, 4, 8, 10, 13],
  '9+5': [0, 4, 8, 10, 14],
  '9sus4': [0, 5, 7, 10, 14],
  maj11: [0, 4, 7, 11, 14, 17],
} as const

/**
 * Chord type alias
 */
const ChordTypeAlias = {
  m: new Set(['minor']),
  M: new Set(['major']),
  dim: new Set(['diminished', 'i']),
  aug: new Set(['a']),
  dim7: new Set(['diminished7', 'i7']),
  '7': new Set(['dom7']),
  M7: new Set(['maj7', 'major7']),
  'm6/9': new Set(['m6,9']),
  '6/9': new Set(['6,9']),
  m7: new Set(['minor7']),
} as const

/**
 * Get chord types
 * @returns Chord types
 */
export const chordTypes = () => Object.keys(ChordStructure)

/**
 * Get notes of specified chord
 * @param root Root note
 * @param type Chord type
 * @returns notes
 */
export const chord = (root: string, type: string): string[] => {
  let chordType: string = type === '' ? 'M' : '1'
  if (Object.keys(ChordStructure).includes(type) !== false) {
    chordType = type
  } else {
    for (const [key, value] of Object.entries(ChordTypeAlias)) {
      if (value.has(type)) {
        chordType = key
        break
      }
    }
  }

  const note = deconstructNote(root)
  if (note === null) {
    return []
  }
  const chromatic = Scale.Chromatic.notes(note.noteName, note.octave, 2)
  const structure = ChordStructure[chordType]
  return structure.map((index) => chromatic[index])
}

/**
 * Get major diatonic chords
 * @param root Root note
 * @returns Major diatonic chords
 */
export const majorDiatonicChords = (root: string): Array<string[]> => {
  const noteInfo = deconstructNote(root)
  if (noteInfo === null) {
    return []
  }
  const types = ['M7', 'm7', 'm7', 'M7', '7', 'm7', 'm7-5']
  return diatonicChords(types, Scale.Ionian, noteInfo.noteName, noteInfo.octave)
}

/**
 * Get natural minor diatonic chords
 * @param root Root note
 * @returns Natural minor diatonic chords
 */
export const naturalMinorDiatonicChords = (root: string): Array<string[]> => {
  const noteInfo = deconstructNote(root)
  if (noteInfo === null) {
    return []
  }
  const types = ['m7', 'm7-5', 'M7', 'm7', 'm7', 'M7', '7']
  return diatonicChords(
    types,
    Scale.Aeorian,
    noteInfo.noteName,
    noteInfo.octave
  )
}

/**
 * Get harmonic minor diatonic chords
 * @param root Root note
 * @returns Harmonic minor diatonic chords
 */
export const harmonicMinorDiatonicChords = (root: string): Array<string[]> => {
  const noteInfo = deconstructNote(root)
  if (noteInfo === null) {
    return []
  }
  const types = ['mM7', 'm7-5', 'M7+5', 'm7', '7', 'M7', 'dim7']
  return diatonicChords(
    types,
    Scale.HarmonicMinor,
    noteInfo.noteName,
    noteInfo.octave
  )
}

/**
 * Get melodic minor diatonic chords
 * @param root Root note
 * @returns Melodic minor diatonic chords
 */
export const melodicMinorDiatonicChords = (root: string): Array<string[]> => {
  const noteInfo = deconstructNote(root)
  if (noteInfo === null) {
    return []
  }
  const types = ['mM7', 'm7', 'M7+5', '7', '7', 'm7-5', 'm7-5']
  return diatonicChords(
    types,
    Scale.MelodicMinorUp,
    noteInfo.noteName,
    noteInfo.octave
  )
}

/**
 * Deconstruct note literal
 * @param note Note literal
 * @returns Note name and octave
 */
const deconstructNote = (
  note: string
): { noteName: string; octave: number } | null => {
  const elements = /^(\D+)(\d*)$/.exec(note)
  if (elements === null || elements.length != 3) {
    return null
  }
  return { noteName: elements[1], octave: +elements[2] }
}

/**
 * Get diatonic chords
 * @param types Chord types
 * @param scale Scale info
 * @param noteName Note name
 * @param octave Octave
 * @returns Diatonic chords
 */
const diatonicChords = (
  types: readonly string[],
  scale: ScaleInfo,
  noteName: string,
  octave: number
) => {
  const notes = scale.notes(noteName, octave, 2)
  return types.map((type, index) => chord(notes[index], type))
}

/**
 * Chord utilities
 */
export const Chr = {
  chordTypes,
  chord,
  harmonicMinorDiatonicChords,
  melodicMinorDiatonicChords,
  majorDiatonicChords,
  naturalMinorDiatonicChords,
} as const
