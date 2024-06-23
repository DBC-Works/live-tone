import { Transport } from 'tone'

import { RunningState, RunSettings } from '@/states/types'

/**
 * Stop playing
 * @param runSettings play settings
 * @param registeredPlayings registered playing set
 */
export const stopPlaying = (
  runSettings: RunSettings,
  runningState: RunningState
): void => {
  const { registeredPlayings } = runningState
  for (const playing of registeredPlayings) {
    if ('state' in playing && playing.state !== 'stopped') {
      playing.stop()
      registeredPlayings.delete(playing)
    }
  }

  if (Transport.state !== 'stopped') {
    Transport.stop()
    if (runSettings.cancelTransportOnStop) {
      Transport.cancel()
    }
  }
}
