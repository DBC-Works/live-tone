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
export interface WebSocketServerAccessor {
  /**
   * Connected
   */
  get connected(): boolean

  /**
   * Open connection
   * @param receiver Receiver
   * @param group Group to send
   */
  // eslint-disable-next-line no-unused-vars
  open(onReceive: ReceiveHandler, group: string): void

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
 * Generic WebSocket server accessor
 */
export class GenericWebSocketServerAccessor implements WebSocketServerAccessor {
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
  ): WebSocketServerAccessor {
    return new GenericWebSocketServerAccessor(url, onChangeState)
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
   * @param _group Group to send(unused)
   */
  // eslint-disable-next-line no-unused-vars
  public async open(onReceive: ReceiveHandler, _group: string): Promise<void> {
    this.client = new WebSocket(this.url)
    this.onChangeState(ConnectionStates.Connecting, false)

    this.client.addEventListener('open', (event) => {
      console.log('GenericWebSocketServerAccessor: opened.', event)
      this.state = ConnectionStates.Connected
      this.onChangeState(ConnectionStates.Connected, false)
    })
    this.client.addEventListener('message', (event) => {
      console.log('GenericWebSocketServerAccessor: receive message.', event)
      onReceive(event.data as string)
    })
    this.client.addEventListener('close', (event) => {
      console.log('GenericWebSocketServerAccessor: closed.', event)
      if (this.state !== ConnectionStates.Disconnected) {
        this.state = ConnectionStates.Disconnected
        this.client = null
        this.onChangeState(ConnectionStates.Disconnected, false)
      }
    })
    this.client.addEventListener('error', (event) => {
      console.log(`GenericWebSocketServerAccessor: receive error.`, event)
      this.state = ConnectionStates.Disconnected
      this.onChangeState(ConnectionStates.Disconnected, true)
    })
  }

  /**
   * Send message to WebSocket server
   * @param message Message to send
   */
  public send(message: string): void {
    console.log('GenericWebSocketServerAccessor: send message.', message)
    if (this.client === null || this.state !== ConnectionStates.Connected) {
      throw new Error('Disconnected')
    }

    this.client.send(message)
  }

  /**
   * Close connection
   */
  public close(): void {
    console.log('GenericWebSocketServerAccessor: close connection.')
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
 * Azure Web PubSub server accessor
 */
export class AzureWebPubSubAccessor implements WebSocketServerAccessor {
  /**
   * Azure Web PubSub server url
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
   * Group
   */
  private group: string = ''

  /**
   * State
   */
  private state: ConnectionState

  /**
   * Create new instance
   * @param url Azure Web PubSub server url
   * @param onChangeState Change state event handler
   * @returns New instance
   */
  public static newInstance(
    url: string,
    onChangeState: ChangeStateEventHandler
  ): WebSocketServerAccessor {
    return new AzureWebPubSubAccessor(url, onChangeState)
  }

  /**
   * Constructor
   * @param url Azure Web PubSub server url
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
   * @param group Group to send
   */
  public async open(onReceive: ReceiveHandler, group: string): Promise<void> {
    this.client = new WebSocket(this.url, 'json.webpubsub.azure.v1')
    this.group = group
    this.onChangeState(ConnectionStates.Connecting, false)

    this.client.addEventListener('open', (event) => {
      console.log('AzureWebPubSubAccessor: opened.', event)
      this.client!.send(
        JSON.stringify({
          type: 'joinGroup',
          group,
        })
      )

      this.state = ConnectionStates.Connected
      this.onChangeState(ConnectionStates.Connected, false)
    })
    this.client.addEventListener('message', (event) => {
      console.log('AzureWebPubSubAccessor: receive message.', event)
      const json = JSON.parse(event.data)
      if (json.type === 'message') {
        if (
          json.from !== 'group' ||
          json.group !== this.group ||
          json.dataType !== 'text'
        ) {
          console.log('AzureWebPubSubAccessor: unexpected message.')
          console.log(
            `AzureWebPubSubAccessor: from=${json.from}, group=${json.group}, dataType=${json.dataType}`
          )
          return
        }
        onReceive(json.data)
      }
    })
    this.client.addEventListener('close', (event) => {
      console.log('AzureWebPubSubAccessor: closed.', event)
      if (this.state !== ConnectionStates.Disconnected) {
        this.state = ConnectionStates.Disconnected
        this.group = ''
        this.client = null
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
   * Send message to Azure Web PubSub
   * @param message Message to send
   */
  public send(message: string): void {
    console.log(`AzureWebPubSubAccessor: send message.`, message)
    if (this.client === null || this.state !== ConnectionStates.Connected) {
      throw new Error('Disconnected')
    }

    this.client.send(
      JSON.stringify({
        type: 'sendToGroup',
        group: this.group,
        dataType: 'text',
        data: message,
      })
    )
  }

  /**
   * Close connection
   */
  public close(): void {
    console.log('AzureWebPubSubAccessor: close connection.')
    if (this.client === null || this.state !== ConnectionStates.Connected) {
      throw new Error('Disconnected')
    }
    this.client.send(
      JSON.stringify({
        type: 'leaveGroup',
        group: this.group,
      })
    )

    this.client.close()
    this.client = null
    this.group = ''
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
) => {
  return new URL(webSocketServerUrl).hostname.endsWith('webpubsub.azure.com')
    ? AzureWebPubSubAccessor.newInstance(webSocketServerUrl, onChangeState)
    : GenericWebSocketServerAccessor.newInstance(
        webSocketServerUrl,
        onChangeState
      )
}
