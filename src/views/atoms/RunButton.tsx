import { useCallback } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import { evalErrorAtom, liveCodeAtom, playAtom } from '@/states/atoms'
import { executeCode } from '@/operations/executionOperations'
// @ts-ignore
import PlayIcon from '@/assets/icons/Play.svg?react'

/**
 * Play button component
 * @returns rendering result
 */
export const RunButton: React.FC = (): JSX.Element => {
  const liveCode = useAtomValue(liveCodeAtom)
  const setPlay = useSetAtom(playAtom)
  const setEvalError = useSetAtom(evalErrorAtom)

  const handleClick = useCallback(() => {
    executeCode(liveCode, { setPlay, setEvalError })
  }, [liveCode, setPlay, setEvalError])

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
