let state = 'stopped'

export const Transport = {
  get state() {
    return state
  },
  start: vi.fn().mockImplementation(() => {
    state = 'started'
  }),
  stop: vi.fn().mockImplementation(() => {
    state = 'stopped'
  }),
}
