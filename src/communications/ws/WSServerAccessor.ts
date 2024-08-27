import { ConnectionState, ConnectionStates } from '@/states/types'

/**
 * Receive event handler type
 */
// eslint-disable-next-line no-unused-vars
export type ReceiveHandler = (message: string) => void

/**
 * Change state event handler type
 */
export type ChangeStateEventHandler = (
  /**
   * Connection state
   */
  // eslint-disable-next-line no-unused-vars
  state: ConnectionState,

  /**
   * As error
   */
  // eslint-disable-next-line no-unused-vars
  asError: boolean
) => void

/**
 * WebSocket server accessor interface
 */
export interface WSServerAccessor {
  /**
   * Connected
   */
  get connected(): boolean

  /**
   * Open connection
   * @param receiver Receiver
   */
  // eslint-disable-next-line no-unused-vars
  open(onReceive: ReceiveHandler): void

  /**
   * Send message to WebSocket server
   * @param message Message to send
   */
  // eslint-disable-next-line no-unused-vars
  send(message: string): void

  /**
   * Close connection
   */
  close(): void
}

/**
 * WebSocket server accessor
 */
export class WebSocketServerAccessor implements WSServerAccessor {
  /**
   * WebSocket server url
   */
  private readonly url: string

  /**
   * Change state event handler
   */
  private readonly onChangeState: ChangeStateEventHandler

  /**
   * WebSocket client
   */
  private client: WebSocket | null = null

  /**
   * State
   */
  private state: ConnectionState

  /**
   * Create new instance
   * @param url WebSocket server url
   * @param onChangeState Change state event handler
   * @returns New instance
   */
  public static newInstance(
    url: string,
    onChangeState: ChangeStateEventHandler
  ): WSServerAccessor {
    return new WebSocketServerAccessor(url, onChangeState)
  }

  /**
   * Constructor
   * @param url WebSocket server url
   * @param onChangeState Change state event handler
   */
  private constructor(url: string, onChangeState: ChangeStateEventHandler) {
    this.url = url
    this.state = ConnectionStates.Disconnected
    this.onChangeState = onChangeState
  }

  /**
   * Connected
   */
  public get connected(): boolean {
    return this.state === ConnectionStates.Connected
  }

  /**
   * Open connection
   * @param onReceive Receive handler
   */
  public async open(onReceive: ReceiveHandler): Promise<void> {
    this.client = new WebSocket(this.url)
    this.onChangeState(ConnectionStates.Connecting, false)

    this.client.addEventListener('open', () => {
      console.log('WebSocketServerAccessor: opened.')
      this.state = ConnectionStates.Connected
      this.onChangeState(ConnectionStates.Connected, false)
    })
    this.client.addEventListener('message', (event) => {
      console.log('WebSocketServerAccessor: receive message.', event)
      onReceive(event.data as string)
    })
    this.client.addEventListener('close', () => {
      console.log('WebSocketServerAccessor: closed.')
      if (this.state !== ConnectionStates.Disconnected) {
        this.state = ConnectionStates.Disconnected
        this.onChangeState(ConnectionStates.Disconnected, false)
      }
    })
    this.client.addEventListener('error', (event) => {
      console.log(`AzureWebPubSubAccessor: receive error.`, event)
      this.state = ConnectionStates.Disconnected
      this.onChangeState(ConnectionStates.Disconnected, true)
    })
  }

  /**
   * Send message to WebSocket server
   * @param message Message to send
   */
  public send(message: string): void {
    if (this.client === null || this.state !== ConnectionStates.Connected) {
      throw new Error('Disconnected')
    }

    this.client.send(message)
  }

  /**
   * Close connection
   */
  public close(): void {
    if (this.client === null || this.state !== ConnectionStates.Connected) {
      throw new Error('Disconnected')
    }

    this.client.close()
    this.client = null
    this.state = ConnectionStates.Disconnected
    this.onChangeState(ConnectionStates.Disconnected, false)
  }
}

/**
 * Create new accessor instance
 * @param webSocketServerUrl WebSocket server url
 * @param onChangeState Change state event handler
 * @returns Accessor
 */
export const newAccessor = (
  webSocketServerUrl: string,
  onChangeState: ChangeStateEventHandler
) => WebSocketServerAccessor.newInstance(webSocketServerUrl, onChangeState)
