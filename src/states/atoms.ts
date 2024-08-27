import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { ConnectableStates, ConnectionStates, ErrorTypes } from './types'
import {
  editSettings,
  errorInfo,
  runningState,
  runSettings,
  sharingSettings,
  webSocketConnectionInfo,
} from './states'
import { newAccessor } from '@/communications/ws/WSServerAccessor'
import { WebSocketConnector } from '@/communications/ws/WebSocketConnector'

/**
 * Running state atom
 */
export const runningStateAtom = atom(runningState)

/**
 * Update write-only atom
 */
export const updateAtom = atom(null, (_, set) => {
  set(runningStateAtom, (runningState) => {
    return {
      ...runningState,
      updated: true,
    }
  })
})

/**
 * Play write-only atom
 */
export const playAtom = atom(null, (_, set) => {
  set(runningStateAtom, (runningState) => {
    return {
      ...runningState,
      nowPlaying: true,
      updated: false,
    }
  })
})

/**
 * Reset running state write-only atom
 */
export const resetRunningStateAtom = atom(null, (_, set) => {
  set(runningStateAtom, (runningState) => {
    runningState.registeredPlayings.clear()
    return {
      ...runningState,
      nowPlaying: false,
      updated: false,
    }
  })
})

/**
 * Live code atom
 */
export const liveCodeAtom = atomWithStorage('liveCode', '')

/**
 * Error information atom
 */
export const errorAtom = atom(errorInfo)

/**
 * Run settings atom
 */
export const runSettingsAtom = atomWithStorage('RunSettings', runSettings)

/**
 * Cancel transport on stop setting read-write atom
 */
export const cancelTransportOnStopRunSettingsAtom = atom(
  (get) => get(runSettingsAtom).cancelTransportOnStop,
  (_, set) => {
    set(runSettingsAtom, (runSettings) => {
      return {
        ...runSettings,
        cancelTransportOnStop: !runSettings.cancelTransportOnStop,
      }
    })
  }
)

/**
 * Edit settings atom
 */
export const editSettingsAtom = atomWithStorage('EditSettings', editSettings)

/**
 * Enable live auto completion read-write atom
 */
export const enableLiveAutoCompletionEditSettingsAtom = atom(
  (get) => get(editSettingsAtom).enableLiveAutoCompletion,
  (_, set) => {
    set(editSettingsAtom, (editSettings) => {
      return {
        ...editSettings,
        enableLiveAutoCompletion: !editSettings.enableLiveAutoCompletion,
      }
    })
  }
)

/**
 * Sharing settings atom
 */
export const sharingSettingsAtom = atom(sharingSettings)

/**
 * WebSocket server url read-write atom
 */
export const webSocketServerUrlAtom = atom(
  (get) => get(sharingSettingsAtom).webSocketServerUrl,
  (_, set, value: string) => {
    set(sharingSettingsAtom, (sharingSettings) => {
      return {
        ...sharingSettings,
        webSocketServerUrl: value,
      }
    })
  }
)

/**
 * Tag of code read-write atom
 */
export const tagOfCodeAtom = atom(
  (get) => get(sharingSettingsAtom).tagOfCode,
  (_, set, value: string) => {
    set(sharingSettingsAtom, (sharingSettings) => {
      return {
        ...sharingSettings,
        tagOfCode: value,
      }
    })
  }
)

/**
 * Connectable state read-only atom
 */
export const connectableStateAtom = atom((get) => {
  const { webSocketServerUrl, tagOfCode } = get(sharingSettingsAtom)
  if (webSocketServerUrl.length === 0 || tagOfCode.length === 0) {
    return ConnectableStates.LackOfInput
  }

  return URL.canParse(webSocketServerUrl) !== false
    ? ConnectableStates.Connectable
    : ConnectableStates.InvalidUrl
})

/**
 * Connection information atom
 */
const connectionInfoAtom = atom(webSocketConnectionInfo)

/**
 * Connection state read-only atom
 */
export const connectionStateAtom = atom((get) => get(connectionInfoAtom).state)

/**
 * Connect write-only atom
 */
export const connectAtom = atom(null, (get, set) => {
  const { webSocketServerUrl } = get(sharingSettingsAtom)
  if (
    webSocketServerUrl === null ||
    URL.canParse(webSocketServerUrl) === false
  ) {
    throw new Error('Invalid WebSocket server url')
  }

  const connectionInfo = get(connectionInfoAtom)
  let { connector, state } = connectionInfo
  try {
    if (connector === null) {
      const accessor = newAccessor(webSocketServerUrl, (state, asError) => {
        set(connectionInfoAtom, {
          connector: state === ConnectionStates.Disconnected ? null : connector,
          state,
        })
        if (asError !== false) {
          const error = new Error('Fail to connect to WebSocket server')
          set(errorAtom, { error, type: ErrorTypes.Connection })
          throw error
        }
      })
      connector = WebSocketConnector.newInstance(accessor)
      // eslint-disable-next-line no-unused-vars
      connector.open((_message) => {
        // TODO: implement
      })
      state = ConnectionStates.Connecting
    }
  } catch (e) {
    set(errorAtom, { error: e as Error, type: ErrorTypes.Connection })
    connector = null
    state = ConnectionStates.Disconnected
    throw e
  }

  return {
    connector,
    state,
  }
})

/**
 * Disconnect write-only atom
 */
export const disconnectAtom = atom(null, (get, set) => {
  const connectionInfo = get(connectionInfoAtom)
  const { connector, state } = connectionInfo
  if (connector === null || state !== ConnectionStates.Connected) {
    throw new Error('Disconnected')
  }

  try {
    connector.close()
  } catch (e) {
    set(errorAtom, { error: e as Error, type: ErrorTypes.Connection })
    throw e
  }

  return {
    connector: null,
    state: ConnectionStates.Disconnected,
  }
})
