import { ChangeEvent, useCallback } from 'react'
import { useAtom } from 'jotai'

import { webSocketServerUrlAtom } from '@/states/atoms'
import { LabeledTextInput } from '@/views/atoms/LabeledTextInput'

type Props = React.ComponentProps<'input'>

/**
 * Web socket server url input text
 * @returns Rendering result
 */
export const WebSocketServerUrlInput: React.FC<Props> = (): JSX.Element => {
  const [webSocketServerUrl, setWebSocketServerUrl] = useAtom(
    webSocketServerUrlAtom
  )
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setWebSocketServerUrl(e.target.value)
    },
    [setWebSocketServerUrl]
  )

  return (
    <LabeledTextInput
      id="ws-url"
      type="url"
      value={webSocketServerUrl}
      onChange={handleChange}
    >
      Azure Web PubSub client access URL
    </LabeledTextInput>
  )
}