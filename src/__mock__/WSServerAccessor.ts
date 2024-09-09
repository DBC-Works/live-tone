import {
  ReceiveHandler,
  ChangeStateEventHandler,
  WebSocketServerAccessor,
} from '@/communications/ws/WSServerAccessor'
import { ConnectionStates } from '@/states/types'

interface Accessor extends WebSocketServerAccessor {
  get latestMessage(): string | null
}

class TestDoubleAccessor implements Accessor {
  private onChangeState: ChangeStateEventHandler
  private onReceive: ReceiveHandler | null = null
  private opened = false
  private sendedMessage: string | null = null

  constructor(onChangeState: ChangeStateEventHandler) {
    this.onChangeState = onChangeState
  }

  get connected(): boolean {
    return this.opened
  }

  get latestMessage(): string | null {
    return this.sendedMessage
  }

  // eslint-disable-next-line no-unused-vars
  public open(onReceive: ReceiveHandler, _group: string): void {
    this.opened = true
    this.onReceive = onReceive
    setTimeout(() => {
      this.onChangeState(ConnectionStates.Connected, false)
    }, 100)
  }

  public send(message: string): void {
    if (this.onReceive === null) {
      throw new Error()
    }
    this.sendedMessage = message

    this.onReceive(message)
  }

  public close(): void {
    this.opened = false
    this.onChangeState(ConnectionStates.Disconnected, false)
  }
}

let testDoubleAccessor: TestDoubleAccessor | null = null

export const newAccessor = (
  _: string,
  onChangeState: ChangeStateEventHandler
) => {
  testDoubleAccessor = new TestDoubleAccessor(onChangeState)
  return testDoubleAccessor
}

export const getTestDoubleAccessor = () => testDoubleAccessor
