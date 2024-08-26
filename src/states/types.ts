import { WebSocketConnector } from '@/communications/ws/WebSocketConnector'

/**
 * Error type
 */
export const ErrorTypes = {
  /**
   * Eval
   */
  Eval: 'Eval',

  /**
   * Connection
   */
  Connection: 'Connection',
} as const satisfies Record<string, string>
export type ErrorType = (typeof ErrorTypes)[keyof typeof ErrorTypes]

/**
 * Error information
 */
export type ErrorInfo = {
  /**
   * Error instance
   */
  error: Error | null

  /**
   * Error type
   */
  type: ErrorType
}

/**
 * Stoppable - instance that has `stop` method
 * this is for runtime evaluation instance
 */
export type Stoppable = any

/**
 * Code state
 */
export const CodeState = {
  /**
   * Ready - not playing
   */
  Ready: 'Ready',

  /**
   * Playing - No code edits after playing
   */
  Playing: 'Playing',

  /**
   * Updated - Edit code after playing
   */
  Updated: 'Updated',

  /**
   * Error
   */
  Error: 'Error',
} as const
export type CodeState = (typeof CodeState)[keyof typeof CodeState]

/**
 * Running state
 */
export type RunningState = {
  /**
   * Playing
   */
  nowPlaying: boolean

  /**
   * Code updated
   */
  updated: boolean

  /**
   * Registered playings
   */
  registeredPlayings: Set<Stoppable>
}

/**
 * Run settings
 */
export type RunSettings = {
  /**
   * Cancel transport on stop
   */
  cancelTransportOnStop: boolean
}

/**
 * Edit settings
 */
export type EditSettings = {
  /**
   * Enable live auto completion
   */
  enableLiveAutoCompletion: boolean
}

/**
 * Sharing settings
 */
export type SharingSettings = {
  /**
   * Web socket server url
   */
  webSocketServerUrl: string

  /**
   * Tag of code
   */
  tagOfCode: string
}

/**
 * Connectable state
 */
export const ConnectableStates = {
  /**
   * Lack of input
   */
  LackOfInput: 'Lack of input',

  /**
   * Invalid url
   */
  InvalidUrl: 'Invalid url',

  /**
   * Connectable
   */
  Connectable: 'Connectable',
} as const satisfies Record<string, string>
export type ConnectableState =
  (typeof ConnectableStates)[keyof typeof ConnectableStates]

/**
 * Connection state
 */
export const ConnectionStates = {
  /**
   * Disconnected
   */
  Disconnected: 'Disconnected',

  /**
   * Connected
   */
  Connecting: 'Connecting',

  /**
   * Connected
   */
  Connected: 'Connected',
} as const satisfies Record<string, string>
export type ConnectionState =
  (typeof ConnectionStates)[keyof typeof ConnectionStates]

/**
 * WebSocket connection info
 */
export type WebSocketConnectionInfo = {
  connector: WebSocketConnector | null
  state: ConnectionState
}
