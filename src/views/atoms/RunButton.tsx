import { useCallback } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import * as Tone from 'tone'

import { evalErrorAtom, liveCodeAtom } from '@/states/atoms'
import { registerPlaying } from '@/operations/statesOperations'
import { Scale } from '@/utilities/music/scale'
// @ts-ignore
import PlayIcon from '@/assets/icons/Play.svg?react'

/**
 * Play button component
 * @returns rendering result
 */
export const RunButton: React.FC = (): JSX.Element => {
  const liveCode = useAtomValue(liveCodeAtom)
  const setEvalError = useSetAtom(evalErrorAtom)

  const handleClick = useCallback(() => {
    try {
      setEvalError(null)
      const LiveTone = {
        registerPlaying,
        Scale,
      }
      new Function('Tone', 'LiveTone', `'use strict';${liveCode}`)(
        Tone,
        LiveTone
      )
    } catch (e) {
      setEvalError(e as Error)
      throw e
    }
  }, [liveCode, setEvalError])

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
