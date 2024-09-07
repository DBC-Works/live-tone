import * as Tone from 'tone'

import { registerPlaying } from '@/operations/statesOperations'
import { Ary, Itr } from '@/utilities/array'
import { Chr } from '@/utilities/music/chord'
import { createErrorFrom, validateCode } from '@/utilities/validation'
import { Nmb } from '@/utilities/number'
import { Scale } from '@/utilities/music/scale'
import { ErrorInfo, ErrorTypes } from '@/states/types'

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
 * @param code Code to execute
 * @param api Api container object
 */
export const executeCode = (code: string, api: Api): void => {
  try {
    api.setError({ error: null, type: ErrorTypes.Eval })

    const errors = validateCode(code)
    if (0 < errors.length) {
      throw createErrorFrom(errors)
    }

    const LiveTone = Object.freeze({
      registerPlaying: Object.freeze(registerPlaying),
      Scale,
      Ary,
      Itr,
      Nmb,
      Chr,
    })
    new Function('Tone', 'LiveTone', `'use strict';${code}`)(Tone, LiveTone)
    api.setPlay()
  } catch (e) {
    api.setError({ error: e as Error, type: ErrorTypes.Eval })
    throw e
  }
}
