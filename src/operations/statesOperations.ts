import { Stoppable } from '@/states/types'
import { playingSet } from '@/states/states'

/**
 * Register playing
 * @param playing playing to register
 */
export const registerPlaying = (playing: Stoppable): void => {
  if ('onstop' in playing) {
    const stopHandler = playing.onstop
    playing.onstop = (playing: any) => {
      if (stopHandler) {
        stopHandler(playing)
      }
      playingSet.delete(playing)
    }
  }
  playingSet.add(playing)
}
