import { getTransport } from 'tone'

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

let allowTransportAccess = true

/**
 * Set allow transport object access flag
 * @param allow Allow flag
 */
export const setAllowTransportAccess = (allow: boolean): void => {
  allowTransportAccess = allow
}

/**
 * Set BPM
 * @param bpm BPM to set
 */
export const setBpm = (bpm: number): void => {
  if (allowTransportAccess !== false) {
    getTransport().bpm.value = bpm
  }
}

/**
 * Start
 */
export const start = (): void => {
  if (allowTransportAccess !== false) {
    getTransport().start()
  }
}
