import { useCallback } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import {
  runningStateAtom,
  runSettingsAtom,
  resetRunningStateAtom,
} from '@/states/atoms'
import { stopPlaying } from '@/operations/toneOperations'
// @ts-ignore
import StopIcon from '@/assets/icons/Stop.svg?react'

/**
 * Stop button component
 * @returns rendering result
 */
export const StopButton: React.FC = (): JSX.Element => {
  const runningState = useAtomValue(runningStateAtom)
  const runSettings = useAtomValue(runSettingsAtom)
  const resetRunningState = useSetAtom(resetRunningStateAtom)

  const handleClick = useCallback(() => {
    stopPlaying(runSettings, runningState)
    resetRunningState()
  }, [runningState, runSettings, resetRunningState])

  return (
    <button className="btn btn-primary w-full" onClick={handleClick}>
      <StopIcon />
      Stop
    </button>
  )
}
