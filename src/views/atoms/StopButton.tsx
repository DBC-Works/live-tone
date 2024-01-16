import { useCallback } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import { playingAtom, resetPlayingAtom } from '@/states/atoms'
import { stopPlaying } from '@/operations/toneOperations'
// @ts-ignore
import StopIcon from '@/assets/icons/Stop.svg?react'

/**
 * Stop button component
 * @returns rendering result
 */
export const StopButton: React.FC = (): JSX.Element => {
  const playingSet = useAtomValue(playingAtom)
  const resetPlaying = useSetAtom(resetPlayingAtom)

  const handleClick = useCallback(() => {
    stopPlaying(playingSet)
    resetPlaying()
  }, [playingSet, resetPlaying])

  return (
    <button className="btn btn-primary w-full" onClick={handleClick}>
      <StopIcon />
      Stop
    </button>
  )
}
