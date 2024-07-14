import { Scale, ScaleInfo } from './scale'

describe('Scale', () => {
  let scales: Readonly<ScaleInfo>[]
  beforeAll(() => {
    scales = Object.entries(Scale).map(([, scale]) => scale)
  })

  it.each([
    ['C,C#,D,D#,E,F,F#,G,G#,A,A#,B,C', 'Chromatic', Scale.Chromatic],
    ['C,D,E,F,G,A,B,C', 'Major', Scale.Major],
    ['C,D,D#,F,G,G#,B,C', 'Harmonic Minor', Scale.HarmonicMinor],
    ['C,D,D#,F,G,A,B,C', 'Melodic Minor Up', Scale.MelodicMinorUp],
    ['C,D,E,F,G,A,B,C', 'Ionian', Scale.Ionian],
    ['C,C#,D#,F,G,G#,A#,C', 'Phrygian', Scale.Phrygian],
    ['C,D,E,F#,G,A,B,C', 'Lydian', Scale.Lydian],
    ['C,D,E,F,G,A,A#,C', 'Mixolydian', Scale.Mixolydian],
    ['C,D,D#,F,G,G#,A#,C', 'Aeorian', Scale.Aeorian],
    ['C,C#,D#,F,F#,G#,A#,C', 'Locrian', Scale.Locrian],
    ['C,D#,E,G,A,A#,C', 'Major Blues', Scale.MajorBlues],
    ['C,D#,F,F#,G,A#,C', 'minor Blues', Scale.MinorBlues],
    ['C,D,D#,F,F#,G#,A,B,C', 'Diminish', Scale.Diminish],
    [
      'C,C#,D#,E,F#,G,A,A#,C',
      'Combination Diminish',
      Scale.CombinationDiminish,
    ],
    ['C,D,E,G,A,C', 'Major Pentatonic', Scale.MajorPentatonic],
    ['C,D#,F,G,A#,C', 'minor Pentatonic', Scale.MinorPentatonic],
    ['C,C#,E,F,G,G#,B,C', 'Raga Bhairav', Scale.RagaBhairav],
    ['C,C#,E,F#,G,A,B,C', 'Raga Gamanasrama', Scale.RagaGamanasrama],
    ['C,C#,D#,F#,G,G#,B,C', 'Raga Todi', Scale.RagaTodi],
    ['C,C#,D#,E,F,G,G#,A#,C', 'Spanish Scale', Scale.SpanishScale],
    ['C,D,D#,F#,G,G#,B,C', 'Gypsy Scale', Scale.GypsyScale],
    ['C,D,E,F,F#,G#,A#,C', 'Arabian Scale', Scale.ArabianScale],
    ['C,D,F,G,A#,C', 'Egyptian Scale', Scale.EgyptianScale],
    ['C,D,D#,G,A,C', 'Hawaiian Scale', Scale.HawaiianScale],
    ['C,C#,D#,G,G#,C', 'Bali Island Pelog', Scale.BaliIslandPelog],
    ['C,C#,F,G,G#,C', 'Japanese Miyakobushi', Scale.JapaneseMiyakobushi],
    ['C,E,F,G,B,C', 'Ryukyu Scale', Scale.RyukyuScale],
    ['C,D,E,F#,G#,A#,C', 'Wholetone', Scale.Wholetone],
    ['C,D#,F#,A,C', 'minor 3rd Interval', Scale.MinorThirdInterval],
    ['C,E,G#,C', '3rd Interval', Scale.ThirdInterval],
    ['C,F,A#,C', '4th Interval', Scale.FourthInterval],
    ['C,G,C', '5th Interval', Scale.FifthInterval],
    ['C,C', 'Octave Interval', Scale.OctaveInterval],
  ])(
    'should return notes "%s" if scale is %s',
    (notes: string, scaleName: string, scale: Readonly<ScaleInfo>) => {
      expect(scale.name).toEqual(scaleName)
      expect(scale.rawNotes.join()).toEqual(notes)
    }
  )

  it.each([
    ['C'],
    ['C#'],
    ['D'],
    ['D#'],
    ['E'],
    ['F'],
    ['F#'],
    ['G'],
    ['G#'],
    ['A'],
    ['A#'],
    ['B'],
  ])('should start and end with "%s"', (key: string) => {
    expect(
      scales
        .map((scale) => scale.notes(key, 3, 2))
        .every(
          (notes) =>
            notes[0] === `${key}3` && notes[notes.length - 1] === `${key}5`
        )
    ).toEqual(true)
  })
})
