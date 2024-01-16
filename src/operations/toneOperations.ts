import { Transport } from 'tone'

import { Stoppable } from '@/states/types'

/**
 * Stop playing
 * @param playingSet registered playing set
 */
export const stopPlaying = (playingSet: Set<Stoppable>): void => {
  for (const playing of playingSet) {
    if ('state' in playing && playing.state !== 'stopped') {
      playing.stop()
      playingSet.delete(playing)
    }
  }
  if (Transport.state !== 'stopped') {
    Transport.stop()
  }
}
