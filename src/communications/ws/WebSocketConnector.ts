import { ReceiveHandler, WebSocketServerAccessor } from './WSServerAccessor'

/**
 * WebSocket connector
 */
export class WebSocketConnector {
  /**
   * WebSocket server accessor
   */
  private readonly accessor: WebSocketServerAccessor

  /**
   * Create new instance
   * @param accessor Accessor
   * @returns New instance
   */
  public static newInstance(
    accessor: WebSocketServerAccessor
  ): WebSocketConnector {
    return new WebSocketConnector(accessor)
  }

  /**
   * Constructor
   * @param accessor Accessor
   */
  private constructor(accessor: WebSocketServerAccessor) {
    this.accessor = accessor
  }

  /**
   * Connected
   */
  public get connected(): boolean {
    return this.accessor.connected
  }

  /**
   * Open connection
   * @param onReceive Receive handler
   * @param group Group to send
   */
  public open(onReceive: ReceiveHandler, group: string): void {
    this.accessor.open(onReceive, group)
  }

  /**
   * Send message to WebSocket server
   * @param message Message to send
   */
  public send(message: string): void {
    this.accessor.send(message)
  }

  /**
   * Close connection
   */
  public close(): void {
    this.accessor.close()
  }
}
