import { useCallback } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import * as Tone from 'tone'

import { evalErrorAtom, liveCodeAtom, playAtom } from '@/states/atoms'
import { registerPlaying } from '@/operations/statesOperations'
import { Ary, Itr } from '@/utilities/array'
import { Nmb } from '@/utilities/number'
import { Scale } from '@/utilities/music/scale'
import { Chr } from '@/utilities/music/chord'
// @ts-ignore
import PlayIcon from '@/assets/icons/Play.svg?react'

/**
 * Play button component
 * @returns rendering result
 */
export const RunButton: React.FC = (): JSX.Element => {
  const liveCode = useAtomValue(liveCodeAtom)
  const play = useSetAtom(playAtom)
  const setEvalError = useSetAtom(evalErrorAtom)

  const handleClick = useCallback(() => {
    try {
      setEvalError(null)
      const LiveTone = Object.freeze({
        registerPlaying: Object.freeze(registerPlaying),
        Scale,
        Ary,
        Itr,
        Nmb,
        Chr,
      })
      new Function('Tone', 'LiveTone', `'use strict';${liveCode}`)(
        Tone,
        LiveTone
      )
      play()
    } catch (e) {
      setEvalError(e as Error)
      throw e
    }
  }, [liveCode, setEvalError, play])

  return (
    <button
      className="btn btn-primary w-full"
      disabled={liveCode.length === 0}
      onClick={handleClick}
    >
      <PlayIcon />
      Run
    </button>
  )
}
