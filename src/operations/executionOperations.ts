import * as Tone from 'tone'

import {
  registerPlaying,
  setAllowTransportAccess,
  setBpm,
  start,
} from '@/operations/statesOperations'
import { Ary, Itr } from '@/utilities/array'
import { Chr } from '@/utilities/music/chord'
import { createErrorFrom, validateCode } from '@/utilities/validation'
import { Nmb } from '@/utilities/number'
import { Scale } from '@/utilities/music/scale'
import { ErrorInfo, ErrorTypes, PlayableCode } from '@/states/types'

/**
 * Api container
 */
export type Api = {
  setPlay: () => void
  // eslint-disable-next-line no-unused-vars
  setError: (_: ErrorInfo) => void
}

/**
 * Execute code
 * @param codes Codes to execute
 * @param api Api container object
 */
export const executeCode = (codes: PlayableCode[], api: Api): void => {
  try {
    api.setError({ error: null, type: ErrorTypes.Eval })

    for (const { code } of codes) {
      const errors = validateCode(code)
      if (0 < errors.length) {
        throw createErrorFrom(errors)
      }
    }

    const LiveTone = Object.freeze({
      registerPlaying: Object.freeze(registerPlaying),
      setBpm: Object.freeze(setBpm),
      start: Object.freeze(start),
      Scale,
      Ary,
      Itr,
      Nmb,
      Chr,
    })
    const code = `'use strict';${codes
      .map(
        ({ code, main }) => `{
setAllowTransportAccess(${main.toString()})
${code}
}`
      )
      .join('')}`
    new Function('Tone', 'LiveTone', 'setAllowTransportAccess', code)(
      Tone,
      LiveTone,
      setAllowTransportAccess
    )
    api.setPlay()
  } catch (e) {
    api.setError({ error: e as Error, type: ErrorTypes.Eval })
    throw e
  }
}
