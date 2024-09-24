import {
  ConnectionStates,
  EditSettings,
  ErrorInfo,
  ErrorTypes,
  ReceiveCodeInfo,
  RunningState,
  RunSettings,
  SharingSettings,
  Stoppable,
  WebSocketConnectionInfo,
} from './types'

/**
 * Error information
 */
export const errorInfo: ErrorInfo = {
  error: null,
  type: ErrorTypes.Eval,
}

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

/**
 * WebSocket server connection info
 */
export const webSocketConnectionInfo: WebSocketConnectionInfo = {
  connector: null,
  id: crypto.randomUUID(),
  state: ConnectionStates.Disconnected,
}

/**
 * Received codes
 */
export const receivedCodes: ReceiveCodeInfo[] = []
