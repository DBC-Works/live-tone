import { useCallback } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import { playingAtom, runSettingsAtom, resetPlayingAtom } from '@/states/atoms'
import { stopPlaying } from '@/operations/toneOperations'
// @ts-ignore
import StopIcon from '@/assets/icons/Stop.svg?react'

/**
 * Stop button component
 * @returns rendering result
 */
export const StopButton: React.FC = (): JSX.Element => {
  const runningState = useAtomValue(playingAtom)
  const runSettings = useAtomValue(runSettingsAtom)
  const resetPlaying = useSetAtom(resetPlayingAtom)

  const handleClick = useCallback(() => {
    stopPlaying(runSettings, runningState)
    resetPlaying()
  }, [runningState, runSettings, resetPlaying])

  return (
    <button className="btn btn-primary w-full" onClick={handleClick}>
      <StopIcon />
      Stop
    </button>
  )
}
