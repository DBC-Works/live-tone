import { RunningState, RunSettings, Stoppable } from './types'

/**
 * Run settings
 */
export const runSettings: RunSettings = {
  cancelTransportOnStop: true,
}

/**
 * Running state
 */
export const runningState: RunningState = {
  nowPlaying: false,
  updated: false,
  registeredPlayings: new Set<Stoppable>([]),
}
