import { waitFor } from '@testing-library/dom'
import { WebSocketConnector } from './WebSocketConnector'
import { newAccessor } from './WSServerAccessor'

describe('WebSocketConnector', () => {
  const createAccessorForTest = () => {
    return newAccessor('wss://example.com', () => {})
  }

  it('should be able to connect to and disconnect from WebSocket server', async () => {
    // arrange
    const connector = WebSocketConnector.newInstance(createAccessorForTest())

    try {
      // act
      connector.open(() => {})
      await waitFor(() => {
        expect(connector.connected).toEqual(true)
      })
      connector.close()

      // assert
      await waitFor(() => {
        expect(connector.connected).toEqual(false)
      })
    } finally {
      if (connector.connected) {
        try {
          connector.close()
        } catch (e) {
          // Do nothing.
        }
      }
    }
  })

  it('should be able to send and receive data', async () => {
    // arrange
    const connector = WebSocketConnector.newInstance(createAccessorForTest())

    try {
      // act
      let receivedMessage: string | null = null
      connector.open((message) => {
        receivedMessage = message
      })
      await waitFor(() => {
        expect(connector.connected).toEqual(true)
      })
      connector.send('send and receive text')

      // assert
      await waitFor(() => {
        expect(receivedMessage).toEqual('send and receive text')
      })

      // tear down
      connector.close()
      await waitFor(() => {
        expect(connector.connected).toEqual(false)
      })
    } finally {
      if (connector.connected) {
        try {
          connector.close()
        } catch (e) {
          // Do nothing.
        }
      }
    }
  })
})
