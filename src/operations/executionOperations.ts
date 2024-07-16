import * as Tone from 'tone'

import { registerPlaying } from '@/operations/statesOperations'
import { Ary, Itr } from '@/utilities/array'
import { Nmb } from '@/utilities/number'
import { Scale } from '@/utilities/music/scale'
import { Chr } from '@/utilities/music/chord'

/**
 * Api container
 */
export type Api = {
  setPlay: () => void
  // eslint-disable-next-line no-unused-vars
  setEvalError: (_: Error | null) => void
}

/**
 * Execute code
 * @param code code to execute
 * @param api api container object
 */
export const executeCode = (code: string, api: Api): void => {
  try {
    api.setEvalError(null)
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
    api.setEvalError(e as Error)
    throw e
  }
}
