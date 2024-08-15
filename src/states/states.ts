import {
  EditSettings,
  RunningState,
  RunSettings,
  SharingSettings,
  Stoppable,
} from './types'

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
 * Sharing settings
 */
export const sharingSettings: SharingSettings = {
  webSocketServerUrl: '',
  tagOfCode: '',
}

/**
 * Running state
 */
export const runningState: RunningState = {
  nowPlaying: false,
  updated: false,
  registeredPlayings: new Set<Stoppable>([]),
}
