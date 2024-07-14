/**
 * Scale information
 */
export class ScaleInfo {
  /**
   * Source notes in 'C'
   */
  private static readonly sourceNotes: readonly string[] = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ] as const

  /**
   * Create new instance
   * @param name Scale name
   * @param pickUpIndexes Pick up indexes
   * @returns New instance
   */
  static newInstance(
    name: string,
    pickUpIndexes: readonly number[] | null
  ): Readonly<ScaleInfo> {
    return Object.freeze(new ScaleInfo(name, pickUpIndexes))
  }

  /* eslint-disable no-unused-vars */
  /**
   * Constructor
   * @param scaleName Scale name
   * @param pickUpIndexes Pick up indexes
   */
  private constructor(
    private readonly scaleName: string,
    private readonly pickUpIndexes: readonly number[] | null
  ) {}
  /* eslint-enable no-unused-vars */

  /**
   * Get scale notes
   * @param chromaticNotes Source chromatic notes
   * @returns Scale notes
   */
  private scaleNotes(chromaticNotes: readonly string[]): readonly string[] {
    return this.pickUpIndexes !== null
      ? chromaticNotes.filter((_, index) =>
          this.pickUpIndexes?.some((n) => n === index % 12)
        )
      : [...chromaticNotes]
  }

  /**
   * Scale name
   */
  get name(): string {
    return this.scaleName
  }

  /**
   * Raw(no octave) notes(in 'C')
   */
  get rawNotes(): readonly string[] {
    const notes = [...ScaleInfo.sourceNotes]
    notes.push(notes[0])
    return this.scaleNotes(notes)
  }

  /**
   * Get transported notes
   * @param key Key
   * @param octave Octave
   * @returns Transported notes
   */
  notes(key: string, octave: number, range: number = 1): readonly string[] {
    const source = ScaleInfo.sourceNotes

    const keyPos = source.findIndex((note) =>
      note.startsWith(key.toUpperCase())
    )
    const transportedOctaveNotes = source
      .slice(keyPos)
      .concat(source.slice(0, keyPos))
    let transportedNotes = [...transportedOctaveNotes]
    for (let index = 1; index < range; ++index) {
      transportedNotes = transportedNotes.concat(transportedOctaveNotes)
    }
    transportedNotes.push(transportedNotes[0])

    let noteOctave = octave
    const notes: string[] = []
    for (let index = 0; index < transportedNotes.length; ++index) {
      if (0 < index && transportedNotes[index] === 'C') {
        ++noteOctave
      }
      notes.push(`${transportedNotes[index]}${noteOctave}`)
    }
    return this.scaleNotes(notes)
  }
}

/**
 * Major / Ionian scale note indexes
 */
const MajorScaleIndexes = [0, 2, 4, 5, 7, 9, 11, 12] as const

/**
 * Natural minor / Aeorian scale note indexes
 */
const NaturalMinorScaleIndexes = [0, 2, 3, 5, 7, 8, 10, 12] as const

/**
 * Scale
 */
export const Scale: Readonly<{
  Chromatic: Readonly<ScaleInfo>

  Major: Readonly<ScaleInfo>
  NaturalMinor: Readonly<ScaleInfo>
  HarmonicMinor: Readonly<ScaleInfo>
  MelodicMinorUp: Readonly<ScaleInfo>

  Ionian: Readonly<ScaleInfo>
  Dorian: Readonly<ScaleInfo>
  Phrygian: Readonly<ScaleInfo>
  Lydian: Readonly<ScaleInfo>
  Mixolydian: Readonly<ScaleInfo>
  Aeorian: Readonly<ScaleInfo>
  Locrian: Readonly<ScaleInfo>
  MajorBlues: Readonly<ScaleInfo>
  MinorBlues: Readonly<ScaleInfo>
  Diminish: Readonly<ScaleInfo>
  CombinationDiminish: Readonly<ScaleInfo>
  MajorPentatonic: Readonly<ScaleInfo>
  MinorPentatonic: Readonly<ScaleInfo>
  RagaBhairav: Readonly<ScaleInfo>
  RagaGamanasrama: Readonly<ScaleInfo>
  RagaTodi: Readonly<ScaleInfo>
  SpanishScale: Readonly<ScaleInfo>
  GypsyScale: Readonly<ScaleInfo>
  ArabianScale: Readonly<ScaleInfo>
  EgyptianScale: Readonly<ScaleInfo>
  HawaiianScale: Readonly<ScaleInfo>
  BaliIslandPelog: Readonly<ScaleInfo>
  JapaneseMiyakobushi: Readonly<ScaleInfo>
  RyukyuScale: Readonly<ScaleInfo>
  Wholetone: Readonly<ScaleInfo>
  MinorThirdInterval: Readonly<ScaleInfo>
  ThirdInterval: Readonly<ScaleInfo>
  FourthInterval: Readonly<ScaleInfo>
  FifthInterval: Readonly<ScaleInfo>
  OctaveInterval: Readonly<ScaleInfo>
}> = Object.freeze({
  Chromatic: ScaleInfo.newInstance('Chromatic', null),

  Major: ScaleInfo.newInstance('Major', MajorScaleIndexes),
  NaturalMinor: ScaleInfo.newInstance(
    'Natural Minor',
    NaturalMinorScaleIndexes
  ),
  HarmonicMinor: ScaleInfo.newInstance(
    'Harmonic Minor',
    [0, 2, 3, 5, 7, 8, 11, 12]
  ),
  MelodicMinorUp: ScaleInfo.newInstance(
    'Melodic Minor Up',
    [0, 2, 3, 5, 7, 9, 11, 12]
  ),

  Ionian: ScaleInfo.newInstance('Ionian', MajorScaleIndexes),
  Dorian: ScaleInfo.newInstance('Dorian', [0, 2, 3, 5, 7, 9, 10, 12]),
  Phrygian: ScaleInfo.newInstance('Phrygian', [0, 1, 3, 5, 7, 8, 10, 12]),
  Lydian: ScaleInfo.newInstance('Lydian', [0, 2, 4, 6, 7, 9, 11, 12]),
  Mixolydian: ScaleInfo.newInstance('Mixolydian', [0, 2, 4, 5, 7, 9, 10, 12]),
  Aeorian: ScaleInfo.newInstance('Aeorian', NaturalMinorScaleIndexes),
  Locrian: ScaleInfo.newInstance('Locrian', [0, 1, 3, 5, 6, 8, 10, 12]),
  MajorBlues: ScaleInfo.newInstance('Major Blues', [0, 3, 4, 7, 9, 10, 12]),
  MinorBlues: ScaleInfo.newInstance('minor Blues', [0, 3, 5, 6, 7, 10, 12]),
  Diminish: ScaleInfo.newInstance('Diminish', [0, 2, 3, 5, 6, 8, 9, 11, 12]),
  CombinationDiminish: ScaleInfo.newInstance(
    'Combination Diminish',
    [0, 1, 3, 4, 6, 7, 9, 10, 12]
  ),
  MajorPentatonic: ScaleInfo.newInstance(
    'Major Pentatonic',
    [0, 2, 4, 7, 9, 12]
  ),
  MinorPentatonic: ScaleInfo.newInstance(
    'minor Pentatonic',
    [0, 3, 5, 7, 10, 12]
  ),
  RagaBhairav: ScaleInfo.newInstance(
    'Raga Bhairav',
    [0, 1, 4, 5, 7, 8, 11, 12]
  ),
  RagaGamanasrama: ScaleInfo.newInstance(
    'Raga Gamanasrama',
    [0, 1, 4, 6, 7, 9, 11, 12]
  ),
  RagaTodi: ScaleInfo.newInstance('Raga Todi', [0, 1, 3, 6, 7, 8, 11, 12]),
  SpanishScale: ScaleInfo.newInstance(
    'Spanish Scale',
    [0, 1, 3, 4, 5, 7, 8, 10, 12]
  ),
  GypsyScale: ScaleInfo.newInstance('Gypsy Scale', [0, 2, 3, 6, 7, 8, 11, 12]),
  ArabianScale: ScaleInfo.newInstance(
    'Arabian Scale',
    [0, 2, 4, 5, 6, 8, 10, 12]
  ),
  EgyptianScale: ScaleInfo.newInstance('Egyptian Scale', [0, 2, 5, 7, 10, 12]),
  HawaiianScale: ScaleInfo.newInstance('Hawaiian Scale', [0, 2, 3, 7, 9, 12]),
  BaliIslandPelog: ScaleInfo.newInstance(
    'Bali Island Pelog',
    [0, 1, 3, 7, 8, 12]
  ),
  JapaneseMiyakobushi: ScaleInfo.newInstance(
    'Japanese Miyakobushi',
    [0, 1, 5, 7, 8, 12]
  ),
  RyukyuScale: ScaleInfo.newInstance('Ryukyu Scale', [0, 4, 5, 7, 11, 12]),
  Wholetone: ScaleInfo.newInstance('Wholetone', [0, 2, 4, 6, 8, 10, 12]),
  MinorThirdInterval: ScaleInfo.newInstance(
    'minor 3rd Interval',
    [0, 3, 6, 9, 12]
  ),
  ThirdInterval: ScaleInfo.newInstance('3rd Interval', [0, 4, 8, 12]),
  FourthInterval: ScaleInfo.newInstance('4th Interval', [0, 5, 10, 12]),
  FifthInterval: ScaleInfo.newInstance('5th Interval', [0, 7, 12]),
  OctaveInterval: ScaleInfo.newInstance('Octave Interval', [0, 12]),
} as const)
