import { Transport } from 'tone'

import { RunSettings, Stoppable } from '@/states/types'

/**
 * Stop playing
 * @param playingSet play settings
 * @param playingSet registered playing set
 */
export const stopPlaying = (
  runSettings: RunSettings,
  playingSet: Set<Stoppable>
): void => {
  for (const playing of playingSet) {
    if ('state' in playing && playing.state !== 'stopped') {
      playing.stop()
      playingSet.delete(playing)
    }
  }

  if (Transport.state !== 'stopped') {
    Transport.stop()
    if (runSettings.cancelTransportOnStop) {
      Transport.cancel()
    }
  }
}
