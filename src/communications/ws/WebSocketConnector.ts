import { ReceiveHandler, WSServerAccessor } from './WSServerAccessor'

/**
 * WebSocket connector
 */
export class WebSocketConnector {
  /**
   * WebSocket server accessor
   */
  private readonly accessor: WSServerAccessor

  /**
   * Create new instance
   * @param accessor Accessor
   * @returns New instance
   */
  public static newInstance(accessor: WSServerAccessor): WebSocketConnector {
    return new WebSocketConnector(accessor)
  }

  /**
   * Constructor
   * @param accessor Accessor
   */
  private constructor(accessor: WSServerAccessor) {
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
   */
  public open(onReceive: ReceiveHandler): void {
    this.accessor.open(onReceive)
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
