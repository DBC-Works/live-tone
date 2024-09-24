import { useCallback } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import { errorAtom, playableCodesAtom, playAtom } from '@/states/atoms'
import { executeCode } from '@/operations/executionOperations'
// @ts-ignore
import PlayIcon from '@/assets/icons/Play.svg?react'

/**
 * Play button component
 * @returns rendering result
 */
export const RunButton: React.FC = (): JSX.Element => {
  const playableCodes = useAtomValue(playableCodesAtom)
  const setPlay = useSetAtom(playAtom)
  const setError = useSetAtom(errorAtom)

  const handleClick = useCallback(() => {
    executeCode(playableCodes, { setPlay, setError })
  }, [playableCodes, setPlay, setError])

  return (
    <button
      className="btn btn-primary w-full"
      disabled={
        playableCodes.reduce((length, code) => code.length + length, 0) === 0
      }
      onClick={handleClick}
    >
      <PlayIcon />
      Run
    </button>
  )
}
