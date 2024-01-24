let state = 'stopped'

export const Transport = {
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
