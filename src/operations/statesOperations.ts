import { Stoppable } from '@/states/types'
import { runningState } from '@/states/states'

/**
 * Register playing
 * @param playing playing to register
 */
export const registerPlaying = (playing: Stoppable): void => {
  const { registeredPlayings } = runningState

  if ('onstop' in playing) {
    const stopHandler = playing.onstop
    playing.onstop = (playing: any) => {
      if (stopHandler) {
        stopHandler(playing)
      }
      registeredPlayings.delete(playing)
    }
  }
  registeredPlayings.add(playing)
}
