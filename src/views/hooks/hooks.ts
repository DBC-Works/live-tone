import { useAtomValue } from 'jotai'

import { CodeState, ErrorTypes } from '@/states/types'
import { errorAtom, runningStateAtom } from '@/states/atoms'

/**
 * Use code sate hook
 * @returns Code state
 */
export const useCodeState = (): CodeState => {
  const { nowPlaying, updated } = useAtomValue(runningStateAtom)
  const { error, type } = useAtomValue(errorAtom)

  if (error !== null && type === ErrorTypes.Eval) {
    return CodeState.Error
  }
  if (nowPlaying === false) {
    return CodeState.Ready
  }

  return updated !== false ? CodeState.Updated : CodeState.Playing
}
