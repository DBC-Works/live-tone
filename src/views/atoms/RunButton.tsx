import { useCallback } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import { errorAtom, liveCodeAtom, playAtom } from '@/states/atoms'
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
  const setError = useSetAtom(errorAtom)

  const handleClick = useCallback(() => {
    executeCode(liveCode, { setPlay, setError })
  }, [liveCode, setPlay, setError])

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
