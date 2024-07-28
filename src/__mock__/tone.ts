let state = 'stopped'

const transportMock = {
  get state() {
    return state
  },
  start: vi.fn(() => {
    state = 'started'
  }),
  stop: vi.fn(() => {
    state = 'stopped'
  }),
  cancel: vi.fn(),
}

export const Transport = transportMock
export const getTransport = () => transportMock
