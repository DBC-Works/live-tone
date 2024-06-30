import { EditSettings, RunningState, RunSettings, Stoppable } from './types'

/**
 * Edit settings
 */
export const editSettings: EditSettings = {
  enableLiveAutoCompletion: false,
}

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
