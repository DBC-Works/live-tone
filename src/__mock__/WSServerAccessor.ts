import {
  ReceiveHandler,
  ChangeStateEventHandler,
  WSServerAccessor,
} from '@/communications/ws/WSServerAccessor'
import { ConnectionStates } from '@/states/types'

class TestDoubleAccessor implements WSServerAccessor {
  private onChangeState: ChangeStateEventHandler
  private onReceive: ReceiveHandler | null = null
  private opened = false

  constructor(onChangeState: ChangeStateEventHandler) {
    this.onChangeState = onChangeState
  }

  get connected(): boolean {
    return this.opened
  }

  public open(onReceive: ReceiveHandler): void {
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

    this.onReceive(message)
  }

  public close(): void {
    this.opened = false
    this.onChangeState(ConnectionStates.Disconnected, false)
  }
}

export const newAccessor = (
  _: string,
  onChangeState: ChangeStateEventHandler
) => new TestDoubleAccessor(onChangeState)
