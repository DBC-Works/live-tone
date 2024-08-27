import { useCallback } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import { ConnectableStates, ConnectionStates, ErrorTypes } from '@/states/types'
import {
  connectableStateAtom,
  connectionStateAtom,
  connectAtom,
  disconnectAtom,
  errorAtom,
} from '@/states/atoms'

// @ts-ignore
import CloudIcon from '@/assets/icons/Cloud.svg?react'
// @ts-ignore
import CloudOffIcon from '@/assets/icons/CloudOff.svg?react'

type Props = React.ComponentProps<'button'>

/**
 * Connect / disconnect button component
 * @returns Rendering result
 */
export const ConnectButton: React.FC<Props> = (): JSX.Element => {
  const connectableState = useAtomValue(connectableStateAtom)
  const connectionState = useAtomValue(connectionStateAtom)
  const connect = useSetAtom(connectAtom)
  const disconnect = useSetAtom(disconnectAtom)
  const setError = useSetAtom(errorAtom)

  const handleClick = useCallback(() => {
    if (connectionState === ConnectionStates.Connected) {
      disconnect()
    } else {
      setError({ error: null, type: ErrorTypes.Connection })
      connect()
    }
  }, [connect, connectionState, disconnect, setError])

  return (
    <button
      className="btn w-full"
      disabled={
        connectableState !== ConnectableStates.Connectable ||
        connectionState === ConnectionStates.Connecting
      }
      onClick={handleClick}
    >
      {connectionState === ConnectionStates.Disconnected && (
        <>
          <CloudIcon />
          Connect
        </>
      )}
      {connectionState === ConnectionStates.Connecting && (
        <>
          <span className="loading loading-spinner loading-sm"></span>
          Connecting...
        </>
      )}
      {connectionState === ConnectionStates.Connected && (
        <>
          <CloudOffIcon />
          Disconnect
        </>
      )}
    </button>
  )
}
